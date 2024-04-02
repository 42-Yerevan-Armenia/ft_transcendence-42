from django.shortcuts import render
# from . import app

def index(request):
    # app.game()
    return render(request, 'index.html')

from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from core.models import Person, GameRoom
from django.http import JsonResponse
import random

class PlayRandom(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            user_id = Person.objects.get(id=pk)
            mms = MatchmakingSystem()
            if user_id.id in mms.player_pool:
                return JsonResponse({"success": "false", "error": "User is already in a game room"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                mms.add_player_to_pool(user_id)
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

    def start_match(self, player1_id, player2_id):
        print("✅", player1_id, player2_id)
        return player1_id

class PlayTournament(APIView):
    def post(self, request):
        creator_id = request.data.get('creator_id')
        game_room_id = request.data.get('game_room_id')
        creator = Person.objects.get(id=creator_id)
        game_room = creator.game_room
        tns = TournamentSystem(game_room.players.all())
        tns.run_tournament()
        winner = tns.winners[0]
        return JsonResponse({"success": "true", "winner": winner}, status=status.HTTP_200_OK)
        # return JsonResponse({"success": "true"}, status=status.HTTP_200_OK)
       
class TournamentSystem:
    def __init__(self, players):
        self.players = players
        self.groups = []
        self.winners = []
    
    def run_tournament(self):
        self.create_groups() # Divide players into initial groups
        all_round_winners = []
        for group in self.groups:
            round_winners = self.run_rounds(group)  # Run initial matches for each group
            all_round_winners.extend(round_winners)  # Collect round winners from each group
        self.round_winners(all_round_winners) # Add winners for next rounds
        while len(self.winners) > 1:
            self.next_round()
            for group in self.groups:
                round_winners = self.run_matches(group) # Run matches for each new group
                print("❌", round_winners)
            self.get_winners()
        winner = self.winners[0]
        print(f"Tournament winner is: {winner}")

    def create_groups(self): # Finished
        player_ids = list(self.players.values_list('id', flat=True))  # Extract player IDs from queryset
        random.shuffle(player_ids)  # Shuffle the list of player IDs
        num_players = len(player_ids)
        num_groups = num_players // 2
        # Divide shuffled player IDs into groups of two
        self.groups = [player_ids[i:i+2] for i in range(0, num_players, 2)]
        print("START", self.groups)

    def run_rounds(self, group): # Finished
        round_winners = []
        for i in range(0, len(group), 2):
            player_1 = group[i]
            player_2 = group[i+1]
            round_winner = self.run_match(player_1, player_2)
            round_winners.append(round_winner)
            print("Winners", round_winners)
        return round_winners

    def round_winners(self, round_winners): 
        self.winners.extend(round_winners)

    def next_round(self):
        self.groups.clear() # Clear the existing groups
        num_winners = len(self.winners)
        # If there's an odd number of winners, add the last one to the next round without pairing
        if num_winners % 2 == 1:
            self.groups.append([self.winners[-1]])
            num_winners -= 1
        # Pair up the winners for the next round
        for i in range(0, num_winners, 2):
            group = self.winners[i:i+2]
            self.groups.append(group)

    def run_match(self, player_1, player_2): # Finished
        mms = MatchmakingSystem()
        win = mms.start_match(player_1, player_2)
        return win

    def run_matches(self, group):
        mms = MatchmakingSystem()
        round_winners = []
        for i in range(0, len(group), 2):
            player_1 = group[i]
            player_2 = group[i+1]
            win = mms.start_match(player_1, player_2)
            round_winners.append(win)
        return round_winners

    def get_winners(self):
        # Assuming each match returns a winner randomly for demonstration purposes
        round_winners = []
        for group in self.groups:
            round_winner = random.choice(group)
            round_winners.append(round_winner)
            print("❎", group)
        self.winners = round_winners

class GameResult(APIView):

    def post(self, request):
        try:
            # Assuming you receive the user ids and game result (win or lose) in the request data
            user1_id = request.data.get('user1_id')
            user2_id = request.data.get('user2_id')
            result_user1 = request.data.get('result_user1')  # Assuming 1 for win, 0 for lose
            result_user2 = request.data.get('result_user2')
            # Retrieve user objects
            user1 = Person.objects.get(id=user1_id)
            user2 = Person.objects.get(id=user2_id)
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
            # Optional: Return updated leaderboard data for both users
            serializer_user1 = LederboardSerializer(user1)
            serializer_user2 = LederboardSerializer(user2)
            return Response({
                "success": "true",
                "user1_profile": serializer_user1.data,
                "user2_profile": serializer_user2.data
            }, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)