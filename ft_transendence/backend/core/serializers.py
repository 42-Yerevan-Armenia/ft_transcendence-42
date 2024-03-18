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
    class Meta:
        model = Person
        fields = ('id', 'nickname', 'image', 'gamemode')

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

#TODO: check friends data

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

from rest_framework import serializers

class GameRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameRoom
        fields = ['id', 'max_players', 'live', 'theme', 'gamemode', 'creator']
