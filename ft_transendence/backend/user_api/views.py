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
import os
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
        # login = request.data.get('login')

        login = 'healeksa'
        # if (login == None or login == ""):
        #     return Response({"success": "false", "error": "login not provided"}, status=400)
        # Check if user is exists
        user = User.objects.filter(username=login).first()
        person = Person.objects.filter(nickname=login).first()
        if (user == None and person == None):
            user_info = self.get_user_info(login, access_token['access_token'])
            if (user_info == None or user_info == {}):
                return Response({"success": "false", "error": "invalid login"}, status=401)
            # Assuming you have received the image information dictionary
            image_info = user_info['image']
            # Extract the desired image URL from the dictionary
            image_url = image_info['link']
            # Fetch the image from the URL
            image_response = requests.get(image_url)
            if image_response.status_code == 200:
                image_content_base64 = base64.b64encode(image_response.content).decode('utf-8')
                user = User.objects.create(
                    first_name=user_info['first_name'],
                    username=user_info['login'],
                )
                data = Person.objects.create(
                    user=user,
                    name = user_info['first_name'],
                    nickname=user_info['login'],
                    image=image_content_base64
                )
        response_data = {
            "success": "true",
            "access": access_token,
            "user": {
                "id": user_info['id'],
                "name": data.name,
                "nickname": data.nickname,
                "image": data.image,
            }
        }
            
        user = User.objects.filter(username=response_data.user.nickname).first()
        person = Person.objects.filter(nickname=response_data.user.nickname).first()
        if (user == None and person == None):
            user = User.objects.create(
                first_name=user_info['first_name'],
                username=user_info['login'],
            )
            data = Person.objects.create(
                user=user,
                name = user_info['first_name'],
                nickname=user_info['login'],
                image=image_content_base64
            )
            return JsonResponse({"success": "true", "data": response_data})
        else:
            user_info = self.get_user_info(login, access_token['access_token'])
            image_info = user_info['image']
            # Extract the desired image URL from the dictionary
            image_url = image_info['link']
            # Fetch the image from the URL
            image_response = requests.get(image_url)
            image_content_base64 = base64.b64encode(image_response.content).decode('utf-8')
            response_data = {
                "success": "true",
                "access": access_token,
                "user": {
                    "id": user_info['id'],
                    "name": user_info['first_name'],
                    "nickname": user_info['login'],
                    "image": image_content_base64,
                }
            }
            return JsonResponse({"success": "true", "data": response_data})

    def get_user_info(self, login, access_token):
        headers = {'Authorization': 'Bearer ' + access_token}
        response = requests.get(
                os.environ.get('INTRA_API_URL') + '/v2/users/' + login,
                headers=headers)
        return response.json()

    def get_access_token(self, code):
        data = {
            'grant_type': 'client_credentials',
            'client_id': os.environ.get('INTRA_API_UID'),
            'client_secret': os.environ.get('INTRA_API_SECRET'),
            'code': code,
        }
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        if response.status_code != 200:
            return None
        print("✅", response.json())
        return response.json()

class IntraMe(APIView):
    def get(self, request):
        user = request.user
        print("❌", user)
        if (user == None):
            return JsonResponse({"success": "false", "error": "User not logged in"}, status=401)
        return Response({
            'username': user.username,
            'first_name': user.first_name,
        }, status=200)

class IntraCallback(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if (code == None):
            return redirect(os.environ.get('FRONTEND_URL') \
                    + '/login?error=invalid_code', status=401)
        return redirect(os.environ.get('FRONTEND_URL') + '/login?code=' + code)

