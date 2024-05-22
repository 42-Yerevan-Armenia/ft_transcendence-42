from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

from core.serializers import MatchSerializer
from core.models import User, Person, GameRoom, History
from friendship.models import Block
from game.models import GameInvite, Round

from django.http import JsonResponse
from django.utils import timezone
from django.views.decorators.csrf import csrf_exempt

from channels.layers import get_channel_layer

from asgiref.sync import async_to_sync, sync_to_async
from django.db.models import Q

import time
import random
import asyncio

def call_async(coro):
    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        return asyncio.run(coro)
    else:
        return loop.run_until_complete(coro)

class LiveGames():
    _instance = None
    _channel_layer = get_channel_layer()

    def __new__(cls):
        if cls._instance is None:
            cls._channel_layer = get_channel_layer()
            cls._group_name = None
            cls._instance = super().__new__(cls)
            cls.games = []
            cls._instance.player_pool = []
        return cls._instance

    async def do_bradcast(self):
        if self._group_name:
            await self._channel_layer.group_send(
                self._group_name,
                {
                    "type": "stream_sate_live",
                    "liveGames": self.games
                }
            )

    def add_game(self, game_id, game):
        self.games.append(game)


    async def del_game(self, game_id):
        for i, game in enumerate(self.games):
            if game["game_room"]["room_id"] == game_id:
                del self.games[i]
                break

    async def set_winner(self, winner, loser):
        winner_person = await sync_to_async(Person.objects.get)(id=winner)
        game_room = await sync_to_async(lambda: winner_person.game_room)()
        await sync_to_async(game_results_history)(winner, loser, winner)
        if game_room.max_players == 2:
            game_room.ongoing = False
            await sync_to_async(game_room.save)()
            players = await sync_to_async(list)(game_room.players.all())
            for player in players:
                player.ongoing = False
                await sync_to_async(player.save)()
            await sync_to_async(Person.objects.filter(game_room_id=game_room.id).update)(game_room_id=None)
        else:
            loser_person = await sync_to_async(Person.objects.get)(id=loser)
            loser_person.game_room_id = None
            loser_person.ongoing = False
            await sync_to_async(loser_person.save)()
            await sync_to_async(Round.objects.create)(winner=winner_person, game_room=game_room)
        await sync_to_async(self.next_match)(game_room)

    def next_match(self, game_room):
        if len(game_room.players.all()) == 4:
            if not len([p for p in game_room.players.all() if p.game_room_id is None]) == 3: 
                last_round_winners = Round.objects.filter(game_room=game_room).order_by('-id')[:2]
                player_1_id = None
                player_2_id = None
                for winner in last_round_winners:
                    player_1_id = winner.winner_id
                    other_winner = [w for w in last_round_winners if w != winner and w.winner.game_room_id == game_room.id]
                    if other_winner:
                        player_2_id = other_winner[0].winner_id
                        break
                if player_1_id and player_2_id:
                    print("NEXT [", player_1_id, player_2_id, "]")
                    mms = MatchmakingSystem()
                    mms.start_match(player_1_id, player_2_id, game_room.id)
                    Round.objects.filter(game_room=game_room).delete()
            else:
                Round.objects.filter(game_room=game_room).delete()
                game_room.ongoing = False
                game_room.save()
                players = list(game_room.players.all())
                for player in players:
                    player.ongoing = False
                    player.save()
                Person.objects.filter(game_room_id=game_room.id).update(game_room_id=None)
        elif len(game_room.players.all()) == 8:
            if not len([p for p in game_room.players.all() if p.game_room_id is None]) == 7: 
                last_round_winners = Round.objects.filter(game_room=game_room).order_by('-id')[:2]
                player_1_id = None
                player_2_id = None
                for winner in last_round_winners:
                    player_1_id = winner.winner_id
                    other_winner = [w for w in last_round_winners if w != winner and w.winner.game_room_id == game_room.id]
                    if other_winner:
                        player_2_id = other_winner[0].winner_id
                        break
                if player_1_id and player_2_id:
                    mms = MatchmakingSystem()
                    mms.start_match(player_1_id, player_2_id, game_room.id)
                    Round.objects.filter(game_room=game_room).delete()
            else:
                Round.objects.filter(game_room=game_room).delete()
                game_room.ongoing = False
                game_room.save()
                players = list(game_room.players.all())
                for player in players:
                    player.ongoing = False
                    player.save()
                Person.objects.filter(game_room_id=game_room.id).update(game_room_id=None)

    def set_group_name(self, group_name):
        self._group_name = group_name

    def get_game(self, game_id):
        return self.games[game_id]

    def get_all_games(self):
        return self.games

class PlayerPool():
    def __init__(self):
        self.players = {}

    def add_player(self, player_id, player):
        self.players[player_id] = player

    def del_player(self, player_id):
        del self.players[player_id]
    
    def get_player(self, player_id):
        return self.players[player_id]

class Player():
    def __init__(self, id, channel_name):
        self.id = id
        self.joinListConsumer = channel_name

class PlayRandom(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            user_id = Person.objects.get(id=pk)
            mms = MatchmakingSystem()
            if user_id.id in mms.player_pool:
                return JsonResponse({"success": "false", "error": "User is already in a game room"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                game = mms.add_player_to_pool(user_id)
                print("✅", game)
                return JsonResponse({"success": "true", "message": "User successfully added in a game room"}, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class MatchmakingSystem():
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance.player_pool = []  # Initialize player_pool only once
        return cls._instance

    def add_player_to_pool(self, player_id):
        if player_id.id not in self.player_pool:  # Append the id of the player
            self.player_pool.append(player_id.id)
            self.match_players()
    
    def remove_player_from_pool(self, player_id):
        if player_id in self.player_pool:
            self.player_pool.remove(player_id)

    def get_player_info(self, player_id):  # Define the function within the class
        try:
            player = Person.objects.get(id=player_id)
            serializer = MatchSerializer(player)  # Assuming MatchSerializer is properly defined
            return serializer.data
        except Person.DoesNotExist:
            # Handle the case where the player is not found
            return None

    def match_players(self):
        if len(self.player_pool) < 2:
            return # Not enough players to match
        start_time = time.time()
        while time.time() - start_time < 180: # Try matching for 3 minutes
            players = [self.get_player_info(player_id) for player_id in self.player_pool]  # Use self.get_player_info
            sorted_players = sorted(players, key=lambda x: (x['wins'] - x['loses']) / x['matches'] if x['matches'] > 0 else 0, reverse=True)
            # Pair players with similar points
            while len(sorted_players) >= 2:
                player_1 = sorted_players.pop(0)
                player_2 = sorted_players.pop(0)
                self.start_match(player_1['id'], player_2['id']) # Redirect to game application
                self.remove_player_from_pool(player_1['id'])
                self.remove_player_from_pool(player_2['id'])
                return
            time.sleep(10)
        self.match_players_by_points()

    def match_players_by_points(self):
        if len(self.player_pool) < 2:
            return  # Not enough players to match
        players = [self.get_player_info(player_id) for player_id in self.player_pool]  # Use self.get_player_info
        sorted_players = sorted(players, key=lambda x: x['points'])
        # Pair players with similar points
        while len(sorted_players) >= 2:
            player_1 = sorted_players.pop(0)
            player_2 = sorted_players.pop(0)
            self.start_match(player_1['id'], player_2['id'])  # Redirect to game application
            self.remove_player_from_pool(player_1['id'])
            self.remove_player_from_pool(player_2['id'])

    def start_match(self, player1_id, player2_id, room_id):
        try:
            room_id = str(room_id) + str(player1_id) + str(player2_id)
            response_data = {
                "success": True,
                "method": "start_mutch",  # TODO
                "game_room": {
                        "room_id": room_id,
                        "left_id": player1_id,
                        "right_id": player2_id
                }
            }
            LiveGames().add_game(room_id, response_data)
            call_async(LiveGames().do_bradcast())
        except Exception as e:
            return JsonResponse({"success": False, "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PlayTournament(APIView):
    _instance = None

    def __new__(cls, *args, **kwargs):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    @csrf_exempt
    def post(self, request, creator_id=None, game_room_id=None):
        try:
            if creator_id is None:
                creator_id = request.data.get('creator_id')
            if game_room_id is None:
                game_room_id = request.data.get('game_room_id')
            creator = Person.objects.get(id=creator_id)
            game_room = creator.game_room
            game_room.ongoing = True
            for player in game_room.players.all():
                player.ongoing = True
                player.save()
            game_room.game_date = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
            game_room.save()
            tns = TournamentSystem(game_room.players.all(), game_room_id)
            tns.run_tournament()
            return JsonResponse({"success": "true"}, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "Invalid creator ID."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({"success": "false", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentSystem:
    def __init__(self, players, game_room_id):
        self.players = players
        self.groups = []
        self.room_id = game_room_id
    
    def run_tournament(self): # ✅
        self.create_groups() # Divide players into initial groups
        for group in self.groups:
            self.run_rounds(group)  # Run initial matches for each group

    def create_groups(self): # ✅
        player_ids = list(self.players.values_list('id', flat=True))  # Extract player IDs from queryset
        random.shuffle(player_ids)  # Shuffle the list of player IDs
        num_players = len(player_ids)
        num_groups = num_players // 2
        # Divide shuffled player IDs into groups of two
        self.groups = [player_ids[i:i+2] for i in range(0, num_players, 2)]
        print("START", self.groups)

    def run_rounds(self, group): # ✅
        for i in range(0, len(group), 2):
            player_1 = group[i]
            player_2 = group[i+1]
            mms = MatchmakingSystem()
            mms.start_match(player_1, player_2, self.room_id)

def game_results_history(player1_id, player2_id, win):# ✅
    user1 = Person.objects.get(id=player1_id)
    user2 = Person.objects.get(id=player2_id)
    if win == player1_id:
        result_user1 = 1
        result_user2 = 0
    else:
        result_user1 = 0
        result_user2 = 1
    res_user1 = result_user1 == 1
    res_user2 = result_user2 == 1
    # Update game results
    if result_user1 == 1:
        user1.wins += 1
        score1 = 100
    else:
        user1.loses += 1
        score1 = 50
    if result_user2 == 1:
        user2.wins += 1
        score2 = 100
    else:
        user2.loses += 1
        score2 = 50
    # Update match count
    user1.matches += 1
    user2.matches += 1
    # Set percentage bonus
    win_bonus = 0.5
    lose_bonus = 0.25
    match_bonus = 0.1
    # Calculate points
    points_user1 = ( score1 +
        user1.wins * win_bonus +
        user1.loses * lose_bonus +
        user1.matches * match_bonus
    )
    points_user2 = ( score2 +
        user2.wins * win_bonus +
        user2.loses * lose_bonus +
        user2.matches * match_bonus
    )
    # Update points
    user1.points += points_user1
    user2.points += points_user2
    # Save changes to the database
    user1.save()
    user2.save()
    History.objects.create(
        player=user1,
        opponent=user2,
        game_room=user1.game_room,
        win=res_user1,
        lose=not res_user1,
        oponent_points=user2.points,
        gamemode=user1.game_room.gamemode,
        image=user1.image
    )
    
    History.objects.create(
        player=user2,
        opponent=user1,
        game_room=user2.game_room,
        win=res_user2,
        lose=not res_user2,
        oponent_points=user1.points,
        gamemode=user2.game_room.gamemode,
        image=user2.image
    )

class SendInviteRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            usera = request.user
            opponent_id = request.data.get('opponent_id')
            sender = Person.objects.get(id=request.user.id)
            opponent = Person.objects.get(id=opponent_id)
            userb = User.objects.get(id=opponent_id)
            if sender.game_room is None:
                return JsonResponse({"success": "false", "error": "You don't have a game room"}, status=status.HTTP_400_BAD_REQUEST)
            if Block.objects.is_blocked(usera, userb) == True:
                return Response({"success": "false", "error": "You are banned by this user"}, status=status.HTTP_400_BAD_REQUEST)
            if opponent.ongoing == True:
                return JsonResponse({"success": "false", "error": "Opponent is already in another game room"}, status=status.HTTP_400_BAD_REQUEST)
            if sender.game_room and opponent.game_room and sender.game_room == opponent.game_room:
                return JsonResponse({"success": "false", "error": "Opponent is already in the same game room"}, status=status.HTTP_400_BAD_REQUEST)
            invite_request = GameInvite.objects.filter(sender=sender, receiver=opponent).first()
            if invite_request:
                if invite_request.rejected:
                    invite_request.delete()
                else:
                    return Response({"success": "false", "error": "Invitation already sent"}, status=status.HTTP_400_BAD_REQUEST)
            res = GameInvite.objects.create(sender=sender, receiver=opponent)
            return Response({"success": "true", "message": "Invitation sent successfully"}, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "User or opponent not found"}, status=status.HTTP_404_NOT_FOUND)

class AcceptInviteRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            sender_id = request.data.get('sender_id')
            sender = Person.objects.get(id=sender_id)
            oponent = Person.objects.get(id=request.user.id)
            invite_request = GameInvite.objects.filter(sender=sender, receiver=oponent).first()
            if invite_request:
                invite_request.accept()
                if sender.game_room and sender.game_room.is_full() == False:
                    oponent.game_room_id = sender.game_room_id
                    oponent.save()
                    sender.game_room.players.add(oponent)
                    sender.game_room.save()
                    if sender.game_room.is_full():
                        PlayTournament().post(request, game_room_id=sender.game_room_id, creator_id=sender_id)
                        invite_request.delete()
                    return Response({"success": "true", "method": "start_game", "message": "Oponent joind to gameroom"}, status=status.HTTP_200_OK)
                else:
                    return Response({"success": "false", "error": "Game room is full"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"success": "false", "error": "Sender user not found"}, status=status.HTTP_404_NOT_FOUND)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Sender user not found"}, status=status.HTTP_404_NOT_FOUND)

class RejectInviteRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            sender_id = request.data.get('sender_id')
            sender = Person.objects.get(id=sender_id)
            oponent = Person.objects.get(nickname=request.user)
            invite_request = GameInvite.objects.filter(sender=sender, receiver=oponent).first()
            if invite_request:
                invite_request.reject()
                return Response({"success": "true", "method": "reject", "message": "Oponent rejected invitation"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": "false", "error": "Sender user not found"}, status=status.HTTP_404_NOT_FOUND)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Sender user not found"}, status=status.HTTP_404_NOT_FOUND)
