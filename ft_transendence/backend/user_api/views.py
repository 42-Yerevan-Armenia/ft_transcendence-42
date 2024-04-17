from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib.auth.models import User
from core.models import Person
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import AccessToken

import os
import jwt
import json
import base64
import requests

INTRA_LOGIN_URL = f"{os.environ.get('INTRA_API_URL')}/oauth/authorize?client_id={os.environ.get('INTRA_API_UID')}&redirect_uri={os.environ.get('INTRA_REDIRECT_URI')}&response_type=code"

class Login42(APIView):
    def get(self, request):
        return redirect(INTRA_LOGIN_URL)
    
    def post(self, request):
        if (request.user.is_authenticated):
            return Response({"success": "false", "error": "looged in"}, status=200)
        data = json.loads(request.data)
        code = data["code"]
        if (code == None):
            return Response({"success": "false", "error": "no code"}, status=400)
        access_token = self.get_access_token(code)
        if (access_token == None):
            return Response({"success": "false", "error": "access token not provided"}, status=400)
        user_info = self.get_user_info(access_token['access_token'])
        if (user_info == None or user_info == {}):
            return Response({"success": "false", "error": "invalid login"}, status=401)
        login = user_info['login']
        user = User.objects.filter(username=login).first()
        person = Person.objects.filter(nickname=login).first()
        if (user == None and person == None):
            # Assuming you have received the image information dictionary
            image_info = user_info['image']
            # Extract the desired image URL from the dictionary
            image_url = image_info['link']
            # Fetch the image from the URL
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                image_content_base64 = base64.b64encode(image_response.content).decode('utf-8')
                user = User.objects.create(
                    id=user_info['id'],
                    first_name=user_info['first_name'],
                    username=user_info['login'],
                )
                data = Person.objects.create(
                    user=user,
                    id=user_info['id'],
                    name = user_info['first_name'],
                    nickname=user_info['login'],
                    image=image_content_base64,
                    is_online=True
                )
                response_data = {
                    "success": "true",
                    "access": access_token,
                    "user": {
                        "id": data.id,
                        "name": data.name,
                        "nickname": data.nickname,
                        "image": data.image,
                    }
                }
            else:
                return Response({"success": "false", "error": "unable to fetch image"}, status=400)
            return JsonResponse({"success": "true", "data": response_data})
        else:
            person.is_online = True
            person.save()
            response_data = {
                    "success": "true",
                    "access": access_token,
                    "user": {
                        "id": person.id,
                        "name": person.name,
                        "nickname": person.nickname,
                        "image": person.image,
                    }
                }
            return JsonResponse({"success": "true", "data": response_data})

    def get_access_token(self, code):
        data = {
            'grant_type': 'authorization_code',
            'client_id': os.environ.get('INTRA_API_UID'),
            'client_secret': os.environ.get('INTRA_API_SECRET'),
            'redirect_uri':os.environ.get('INTRA_REDIRECT_URI'),
            'code': code,
        }
        headers = {'Content-Type': 'application/x-www-form-urlencoded'}
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data, headers=headers)
        if response.status_code != 200:
            return None
        return response.json()

    def get_user_info(self, access_token):
        headers = {"Authorization": 'bearer ' + access_token, "content-type": "application/json"}
        response = requests.get(
                os.environ.get('INTRA_API_URL') + '/v2/me',
                headers=headers)
        return response.json()
