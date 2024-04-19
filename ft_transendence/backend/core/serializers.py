from rest_framework import serializers
from django import forms
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User, Person, GameRoom, History
from friendship.models import Friend, FriendshipRequest

class UserSerializer(serializers.ModelSerializer):
    friends = serializers.SerializerMethodField()
    friendship_requests = serializers.SerializerMethodField()

    class Meta:
        model = Person
        fields = ('id', 'name', 'nickname', 'email', 'phone', 'image', 'background', 'wins', 'loses', 'matches', 'points', 'gamemode', 'live', 'is_online', 'friends', 'friendship_requests')

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
            }
            serialized_friendships.append(serialized_friendship)
        return serialized_friendships

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

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = History
        fields = '__all__'

class FullHistorySerializer(serializers.ModelSerializer):
    game_date = serializers.SerializerMethodField()
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'gamemode', 'points', 'matches', 'wins', 'loses', 'game_date')
    
    def get_game_date(self, obj):
        try:
            game_rooms = GameRoom.objects.filter(players=obj)
            if game_rooms.exists():
                # Return the game_date from the first GameRoom instance
                return game_rooms.first().game_date
            else:
                return None
        except GameRoom.DoesNotExist:
            return None