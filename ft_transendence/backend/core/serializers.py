from rest_framework import serializers
from django import forms
from django.core.exceptions import ValidationError
from .models import User, Person, GameRoom, History
from game.models import GameInvite
from friendship.models import Friend, FriendshipRequest

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

class WaitingRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'gamemode', 'points')

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'wins', 'loses', 'matches', 'points')

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
    gamemode = serializers.CharField(source='game_room.gamemode', read_only=True)
    date = serializers.DateTimeField(format="%Y-%m-%d %H:%M", read_only=True)

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
        fields = ('opponent_id', 'image', 'nickname', 'gamemode', 'points', 'matches', 'full_history')

    def get_full_history(self, obj):
        history_data = History.objects.filter(opponent=obj)
        full_history_serializer = FullHistorySerializer(history_data, many=True)
        return full_history_serializer.data

class HistorySerializer(serializers.ModelSerializer):
    opponents_history = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('opponents_history',)

    def get_opponents_history(self, obj):
        opponents_with_history = []
        history_data = History.objects.filter(player=obj)
        for history in history_data:
            opponents_with_history.append(history.opponent)
        unique_opponents = set(opponents_with_history)
        opponents_history_serializer = OpponentHistorySerializer(unique_opponents, many=True)
        return opponents_history_serializer.data
