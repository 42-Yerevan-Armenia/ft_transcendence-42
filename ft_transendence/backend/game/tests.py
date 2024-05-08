from django.test import TestCase

# Create your tests here.

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
            response_data = {
                "success": True,
                "method": "start_mutch",
                "game_room": {
                        "room_id": room_id,
                        "left_id": player1_id,
                        "right_id": player2_id
                }
            }
            LiveGames().add_game(room_id, response_data)
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
            game_room.game_date = timezone.now().strftime('%Y-%m-%d %H:%M:%S')
            game_room.save()
            tns = TournamentSystem(game_room.players.all(), game_room_id)
            tns.run_tournament()
            winner = tns.winners[0]
            game_room.ongoing = False
            game_room.players.update(game_room_id=None)
            game_room.save()
            Person.objects.filter(game_room_id=game_room_id).update(game_room_id=None)
            # return JsonResponse({"success": "true"}, status=status.HTTP_200_OK)
            return JsonResponse({"success": "true", "winner": winner}, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "Invalid creator ID."}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return JsonResponse({"success": "false", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TournamentSystem:
    def __init__(self, players, game_room_id):
        self.players = players
        self.groups = []
        self.winners = []
        self.room_id = game_room_id
    
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
                print("❌ round_winners = ", round_winners)
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
        # generate room_id from game_room_id
        mms.start_match(player_1, player_2, self.room_id)
        # call async function to get winner
        win = player_1
        # delete game from LiveGames
        LiveGames().del_game(self.room_id)
        self.update_game_results(player_1, player_2, win)
        self.save_game_history(player_1, player_2, win)
        return win

    def run_matches(self, group):
        mms = MatchmakingSystem()
        round_winners = []
        for i in range(0, len(group), 2):
            player_1 = group[i]
            player_2 = group[i+1]
            win = mms.start_match(player_1, player_2, self.room_id)
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

