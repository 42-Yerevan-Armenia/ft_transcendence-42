from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import Profile

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('name', 'nickname', 'email')  

class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('nickname', 'email')
