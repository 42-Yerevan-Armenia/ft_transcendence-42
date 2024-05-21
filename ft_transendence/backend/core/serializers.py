from rest_framework import serializers
from django import forms
from django.core.exceptions import ValidationError
from .models import User, Person, GameRoom, History
from game.models import GameInvite
from friendship.models import Friend, FriendshipRequest

#TODO 42 intra user in Serializer

class UserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()
    friendship_requests = serializers.SerializerMethodField()
    gameinvite_requests = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('id', 'name', 'nickname', 'email', 'image', 'phone', 'wins', 'loses', 'matches', 'points', 'gamemode', 'live', 'is_online', 'friends', 'friendship_requests', 'gameinvite_requests')

    def get_friends(self, obj):
        friends = Friend.objects.filter(from_user=obj.user)
        serialized_friends = []
        for friend in friends:
            friend_person = friend.to_user.person
            serialized_friend = {
                'id': friend_person.id,
                'name': friend_person.name,
                'nickname': friend_person.nickname,
                'image': friend_person.image,
            }
            serialized_friends.append(serialized_friend)
        return serialized_friends

    def get_friendship_requests(self, obj):
        receiver_requests = FriendshipRequest.objects.filter(to_user_id=obj.user.id)
        serialized_friendships = []
        for friendships in receiver_requests:
            serialized_friendship = {
                'id': friendships.from_user_id,
                'name': friendships.from_user.person.name,
                'nickname': friendships.from_user.person.nickname,
                'image': friendships.from_user.person.image,
                'rejected': friendships.rejected,
            }
            serialized_friendships.append(serialized_friendship)
        return serialized_friendships

    def get_gameinvite_requests(self, obj):
        receiver_requests = GameInvite.objects.filter(receiver_id=obj.id)
        serialized_gameinvites = []
        for gameinvites in receiver_requests:
            serialized_gameinvite = {
                'id': gameinvites.sender_id,
                'name': gameinvites.sender.name,
                'nickname': gameinvites.sender.nickname,
                'image': gameinvites.sender.image,
                'accepted': gameinvites.accepted,
                'rejected': gameinvites.rejected,
            }
            serialized_gameinvites.append(serialized_gameinvite)
        return serialized_gameinvites

class HomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'points', 'live')

class LeaderboardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'wins', 'loses', 'matches', 'points')

class SettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'name', 'nickname', 'email', 'password', 'phone', 'image', 'background', 'gamemode')

class JoinListSerializer(serializers.ModelSerializer):
    max_players = serializers.SerializerMethodField()
    class Meta:
        model = Person
        fields = ('id', 'image', 'game_room_id', 'gamemode', 'max_players')
    
    def get_max_players(self, obj):
        try:
            game_room = GameRoom.objects.get(players=obj)
            return game_room.max_players
        except GameRoom.DoesNotExist:
            return None

class CustomSerializer(serializers.ModelSerializer):
    person_id = serializers.IntegerField(source='id')
    person_image = serializers.CharField(source='image')
    gameroom_id = serializers.SerializerMethodField()
    gameroom_max_players = serializers.SerializerMethodField()
    gameroom_gamemode = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('person_id', 'person_image', 'gameroom_id', 'gameroom_max_players', 'gameroom_gamemode')

    def get_gameroom_id(self, obj):
        return obj.game_room.id if obj.game_room else None

    def get_gameroom_max_players(self, obj):
        return obj.game_room.max_players if obj.game_room else None

    def get_gameroom_gamemode(self, obj):
        return obj.game_room.gamemode if obj.game_room else None

class WaitingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'gamemode', 'points')

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'wins', 'loses', 'matches', 'points')

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image')

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friend
        fields = ('id', 'to_user_id')

class ProfileSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'background', 'wins', 'loses', 'friends')

    def get_friends(self, obj):
        friends = Friend.objects.friends(obj.user)
        return FriendSerializer(friends, many=True).data if friends else []

class GameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRoom
        fields = ['id', 'max_players', 'live', 'theme', 'gamemode', 'creator', 'players', 'ongoing', 'game_date']

    def create(self, validated_data):
        creator_id = validated_data.pop('creator').id
        players_data = validated_data.pop('players', [])
        game_room = GameRoom.objects.create(creator_id=creator_id, **validated_data)
        game_room.players.set(players_data)
        return game_room

class FullHistorySerializer(serializers.ModelSerializer):
    win = serializers.SerializerMethodField()
    lose = serializers.SerializerMethodField()
    gamemode = serializers.CharField(source='opponent.gamemode', read_only=True)

    class Meta:
        model = History
        fields = ['gamemode', 'date', 'win', 'lose']

    def get_win(self, obj):
        return 1 if obj.win else 0

    def get_lose(self, obj):
        return 1 if obj.lose else 0

class OpponentHistorySerializer(serializers.ModelSerializer):
    full_history = serializers.SerializerMethodField()
    opponent_id = serializers.IntegerField(source='id')

    class Meta:
        model = Person
        fields = ('opponent_id', 'nickname', 'gamemode', 'points', 'matches', 'full_history')

    def get_full_history(self, obj):
        history_data = History.objects.filter(opponent=obj)
        full_history_serializer = FullHistorySerializer(history_data, many=True)
        grouped_full_history = {}
        for entry in full_history_serializer.data:
            opponent_id = obj.id
            if opponent_id not in grouped_full_history:
                grouped_full_history[opponent_id] = []
            grouped_full_history[opponent_id].append(entry)
        response_full_history = [
            {"opponent_id": opponent_id, "played_games": games}
            for opponent_id, games in grouped_full_history.items()
        ]
        return response_full_history

class HistorySerializer(serializers.ModelSerializer):
    opponents_history = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('opponents_history',)

    def get_opponents_history(self, obj):
        opponents = Person.objects.all()  # Assuming you want all persons
        opponents_history_serializer = OpponentHistorySerializer(opponents, many=True)
        return opponents_history_serializer.data

# [{
#     'success': True,
#     'history': [
#         {
#             'opponent.id': 3,
#             'nickname': 'Userc',
#             'gamemode': 'classic',
#             'points': 769,
#             'matches': 9,
#             'full_history': [
#                 {
#                     'opponent_id': '3',
#                     'played_games': [OrderedDict([('gamemode', 'easy'), ('date', '2024-05-20T17:10:57.838057Z'), ('win', 1), ('lose', 0)]),
#                                     OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:18:18.367714Z'), ('win', 0), ('lose', 1)])]
#                 },
#             ]
#         },
#         {
#             'opponent.id': 4,
#             'nickname': 'Usera',
#             'gamemode': 'classic',
#             'points': 7569,
#             'matches': 29,
#             'full_history': [
#                 {
#                     'opponent_id': '4',
#                     'played_games': [OrderedDict([('gamemode', 'hard'), ('date', '2024-05-21T17:10:57.838057Z'), ('win', 1), ('lose', 0)]),
#                                     OrderedDict([('gamemode', 'hard'), ('date', '2024-05-21T17:18:18.367714Z'), ('win', 0), ('lose', 1)])]
#                 },
#             ]
#         },
#     ]
    
# }]

# {
#     'success': True,
#     'history': [
#         OrderedDict([
#             ('opponent_id', 1),
#             ('nickname', 'Usera'),
#             ('gamemode', 'classic'),
#             ('points', 720),
#             ('matches', 10),
#             ('full_history', [
#                 {
#                     'opponent_id': 1,
#                     'played_games': [OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:18:42.431301Z'), ('win', 1), ('lose', 0)])]
#                 }
#             ])
#         ]),
#         OrderedDict([
#             ('opponent_id', 2),
#             ('nickname', 'Userb'),
#             ('gamemode', 'classic'),
#             ('points', 458),
#             ('matches', 7),
#             ('full_history', [])]),
#         OrderedDict([
#             ('opponent_id', 3),
#             ('nickname', 'Userc'),
#             ('gamemode', 'classic'),
#             ('points', 874),
#             ('matches', 10),
#             ('full_history',
#                 [{
#                     'opponent_id': 3,
#                     'played_games': [
#                                         OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:10:57.844553Z'), ('win', 0), ('lose', 1)]),
#                                         OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:18:18.363081Z'), ('win', 1), ('lose', 0)]),
#                                         OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:18:42.436042Z'), ('win', 0), ('lose', 1)]),
#                                         OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:53:58.746545Z'), ('win', 0), ('lose', 1)])
#                                     ]
#                 }]
#             )]),
#         OrderedDict([
#             ('opponent_id', 4),
#             ('nickname', 'Userd'),
#             ('gamemode', 'classic'),
#             ('points', 719),
#             ('matches', 9),
#             ('full_history',
#                 [{
#                     'opponent_id': 4,
#                     'played_games': [
#                                         OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:10:57.838057Z'), ('win', 1), ('lose', 0)]),
#                                         OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:18:18.367714Z'), ('win', 0), ('lose', 1)]),
#                                         OrderedDict([('gamemode', 'classic'), ('date', '2024-05-20T17:53:58.742563Z'), ('win', 1), ('lose', 0)])
#                                     ]
#                 }]
#             )
#             ])
#     ]
# }