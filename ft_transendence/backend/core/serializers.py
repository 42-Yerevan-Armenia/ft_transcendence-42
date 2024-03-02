from rest_framework import serializers
from django import forms
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from .models import Person

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('id', 'name', 'nickname', 'email', 'phone', 'password', 'picture')  

class EmailSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ('nickname', 'email')
