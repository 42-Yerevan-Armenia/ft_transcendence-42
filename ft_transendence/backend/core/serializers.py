from rest_framework import serializers
from django import forms
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import User, Person, GameRoom
from friendship.models import Friend

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'name', 'nickname', 'email', 'phone', 'image', 'background', 'wins', 'loses', 'matches', 'points', 'gamemode', 'live')

class HomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'points', 'live')

class LederboardSerializer(serializers.ModelSerializer):
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

class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'gamemode', 'points', 'matches')

class FullHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'gamemode', 'points', 'matches', 'wins', 'loses', 'gamedata')

class MatchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'wins', 'loses', 'matches', 'points')

class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')

class FriendSerializer(serializers.ModelSerializer):
    user = UsersSerializer(source='user')
    class Meta:
        model = Friend
        fields = ('id', 'friend_user')

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
        fields = ['id', 'max_players', 'live', 'theme', 'gamemode', 'creator', 'players', 'ongoing']

    def create(self, validated_data):
        creator_id = validated_data.pop('creator').id
        players_data = validated_data.pop('players', [])
        game_room = GameRoom.objects.create(creator_id=creator_id, **validated_data)
        game_room.players.set(players_data)
        return game_room
