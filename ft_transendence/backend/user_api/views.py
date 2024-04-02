from django.shortcuts import redirect
from core.models import Person
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication
import os

INTRA_LOGIN_URL = f"{os.environ.get('INTRA_API_URL')}/oauth/authorize?client_id={os.environ.get('INTRA_API_UID')}&redirect_uri={os.environ.get('INTRA_REDIRECT_URI')}&response_type=code"

class Login42(APIView):
    def get(self, request):
        return redirect(INTRA_LOGIN_URL)
    
    def post(self, request):
        if (request.user.is_authenticated()):
            return Response({"success": "false", "error": "looged in"}, status=200)
        code = request.data.get('code')
        if (code == None):
            return Response({"success": "false", "error": "no code"}, status=400)
        login = request.data.get('login')
        if (login == None or login == ""):
            return Response({"success": "false", "error": "login not provided"}, status=400)
        access_token = self.get_access_token(code)
        if (access_token == None):
            return Response({"success": "false", "error": "access token not provided"}, status=400)
        # Check if user is exists
        user = Person.objects.filter(login=login).first()
        if (user == None):
            user_info = self.get_user_info(login, access_token['access_token'])
            if (user_info == None or user_info == {}):
                return Response({"success": "false", "error": "invalid login"}, status=401)
            user = get_user_model().objects.create(
                first_name=user_info['first_name'],
                username=user_info['login'],
            )
            data = Person.objects.create(
                user=user,
                name = user_info['first_name'],
                nickname=user_info['login']
            )
            refresh = RefreshToken.for_user(data)
            access = str(refresh.access_token)
            refresh = str(refresh)
            response_data = {
                "success": "true",
                "access": access,
                "refresh": refresh,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "nickname": user.nickname,
                    "image": user.image,
                }
            }
            return JsonResponse({"success": "true", "data": response_data})
        else:
            return JsonResponse({"success": "false", "error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

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
            'code': code
        }
        response = requests.post('https://api.intra.42.fr/oauth/token', data=data)
        if response.status_code != 200:
            return None
        return response.json()

class IntraMe(APIView):
    def get(self, request):
        user = request.user
        if (user == None):
            return JsonResponse({"success": "false", "error": "User not logged in"}, status=401)
        return Response({
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email
        }, status=200)

class IntraCallback(APIView):
    def get(self, request):
        code = request.GET.get('code')
        if (code == None):
            return redirect(os.environ.get('FRONTEND_URL') \
                    + '/login?error=invalid_code', status=401)
        return redirect(os.environ.get('FRONTEND_URL') + '/login?code=' + code)
