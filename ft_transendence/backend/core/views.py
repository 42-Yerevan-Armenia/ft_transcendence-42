from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Person
from .serializers import UserSerializer, EmailSerializer
from .validations import email_validation, register_validation, send_confirmation_email, password_validation
from .shared_data import shared_data

from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.contrib.sessions.models import Session
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from django.core.files.base import ContentFile
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.utils import timezone
import json
import base64
import os

#TODO: password_reset, 

class UserAPIView(APIView):
    def get(self, request):
        queryset = Person.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = json.loads(request.body)
        return Response(data)
    
    def delete(self, request):
        data = {'message': 'Hello, world! This is delete request!'}
        return Response(data)

class EmailValidation(APIView):
    def post(self, request):
        email = request.data['email'].strip()
        try:
            email_validation(email)
            code = send_confirmation_email(email)
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        confirmation_data = {
            'email': email,
            'code': code,
            'timestamp': timezone.now().isoformat(),
        }
        shared_data['confirmation_data'] = confirmation_data
        return JsonResponse({"success": "true", "email": "model_to_dict(data)"})

class Confirmation(APIView):
    def post(self, request):
        confirm_front = request.data['code']
        if not confirm_front:
            return JsonResponse({"success": "false", "error": "Confirmation code not found"}, status=status.HTTP_400_BAD_REQUEST)
        confirmation_data = shared_data.get('confirmation_data')
        if not confirmation_data:
            return JsonResponse({"success": "false", "error": "Confirmation data not found"}, status=status.HTTP_400_BAD_REQUEST)
        confirm_back = confirmation_data['code']
        timer_str = confirmation_data['timestamp']
        timer = timezone.datetime.fromisoformat(timer_str)
        expiration_time = timer + timezone.timedelta(seconds=30)
        if timezone.now() > expiration_time:
            shared_data.pop('confirmation_data', None)
            return JsonResponse({"success": "false","error": "Confirmation code expired"}, status=status.HTTP_408_REQUEST_TIMEOUT)
        if confirm_front != confirm_back:
            return JsonResponse({"success": "false","error": "Invalid confirmation code"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "message": "Email is validated"})

class Register(APIView):
    def post(self, request):
        confirmation_data = shared_data.get('confirmation_data', {})
        email = confirmation_data.get('email', None)
        if not email:
            return JsonResponse({"success": "false","error": "Email is not validated"}, status=status.HTTP_400_BAD_REQUEST)
        shared_data.pop('confirmation_data', None)
        try:
            register_validation(request.data)
            password = request.data['password'][10:-10]
            hashed_password = make_password(password)
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        user = User.objects.create(
            username=request.data['nickname'],
            email=email,
            password=hashed_password
        )
        try:
            data = Person.objects.create(
                email=email,
                name = request.data['name'],
                nickname=request.data['nickname'],
                password=hashed_password,
            )
            data.save_base64_image(image_path=os.path.join(os.path.dirname(__file__), 'default.jpg'))
            model_to_dict(data)
            data_to_send = {'email': email, 'nickname': request.data['nickname'], 'name': request.data['name']}
        except ValidationError as e:
            user.delete()
            return JsonResponse({"success": "false","error": e.message}, status=500)
        return JsonResponse({"success": "true", "reg": data_to_send})

class PasswordReset(APIView):
    def post(self, request):
        
        email = request.data['email'].strip()
        try:
            if not email:
                raise ValidationError('Waiting for an email address') 
            try:
                validate_email(email)
            except ValidationError:
                raise ValidationError('Invalid email format')
            code = send_confirmation_email(email)
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        confirmation_data = {
            'email': email,
            'code': code,
            'timestamp': timezone.now().isoformat(),
        }
        request.session['confirmation_data'] = confirmation_data
        request.session.save()
        return JsonResponse({"success": "true", "email": "model_to_dict(data)"})

class ForgetConfirmation(APIView):
    def post(self, request):
        confirm_front = request.data['code']
        if not confirm_front:
            return JsonResponse({"success": "false", "error": "Confirmation code not found"}, status=status.HTTP_400_BAD_REQUEST)
        confirmation_data = request.session.get('confirmation_data', None)
        if not confirmation_data:
            return JsonResponse({"success": "false", "error": "Confirmation data not found"}, status=status.HTTP_400_BAD_REQUEST)
        confirm_back = confirmation_data['code']
        timer_str = confirmation_data['timestamp']
        timer = timezone.datetime.fromisoformat(timer_str)
        expiration_time = timer + timezone.timedelta(seconds=30)
        if timezone.now() > expiration_time:
            request.session.pop('confirmation_data', None)
            request.session.save()
            return JsonResponse({"success": "false", "error": "Confirmation code expired"}, status=status.HTTP_408_REQUEST_TIMEOUT)
        if confirm_front != confirm_back:
            return JsonResponse({"success": "false", "error": "Invalid confirmation code"}, status=status.HTTP_404_NOT_FOUND)
        request.session.pop('confirmation_data', None)
        request.session.save()
        return JsonResponse({"success": "true", "message": "Email is validated"})

class Password(APIView):
    def post(self, request):
        confirmation_data = request.session.get('confirmation_data', None)

        if not confirmation_data:
            return JsonResponse({"success": "false", "error": "Confirmation data not found"}, status=status.HTTP_400_BAD_REQUEST)

        email = confirmation_data.get('email')
        password = request.data.get('password')
        try:
            password = password_validation(password)
            person = Person.objects.get(email=email)
            try:
                validate_password(password)
            except ValidationError as e:
                return JsonResponse({"success": "false", "error": e.message}, status=status.HTTP_400_BAD_REQUEST)
            person.password = password
            person.save()
            request.session.pop('confirmation_data', None)
            request.session.save()
            return JsonResponse({"success": "true", "message": "Password successfully updated"})
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "Person not found"}, status=status.HTTP_404_NOT_FOUND)
        except ValidationError as e:
            return JsonResponse({"success": "false", "error": e.message}, status=status.HTTP_400_BAD_REQUEST)

class Login(APIView):
    def post(self, request):
        email = request.data['email']
        password = request.data['password'][10:-10]
        try:
            user = Person.objects.get(email=email)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        if check_password(password, user.password):
            refresh = RefreshToken()
            refresh['email'] = user.email
            access_token = str(refresh.access_token)
            refresh_token = str(refresh)

            response_data = {
                "success": "true",
                "access_token": access_token,
                "refresh_token": refresh_token,
                "user": {
                    "id": user.id,
                    "name": user.name,
                    "nickname": user.nickname,
                    "email": user.email,
                }
            }
            return JsonResponse({"success": "true", "data": response_data})
        else:
            return JsonResponse({"success": "false", "error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

# class Profile(APIView):

#     # authentication_classes = [TokenAuthentication]
#     # permission_classes = [IsAuthenticated]

    # def get(self, request):
    #     users = Person.objects.all()
    #     users_data = [model_to_dict(user) for user in users]
    #     return JsonResponse({"success": "true", "profile": users_data})

class ProfileById(APIView):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "profile": model_to_dict(user)})
    #def put(self, request, pk):
        
    def delete(self, request, pk):
        try:
            user = Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return JsonResponse({"success": "true", "message": "Person deleted successfully"})

class TokenSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token

class TokenView(TokenObtainPairView):
    serializer_class = TokenSerializer

    @api_view(['GET'])
    def getRoutes(request):
        routes = [
            '/api/v1/token/',
            '/api/v1/token/refresh/',
        ]
        return Response(routes)

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        # Set the access token and refresh token as cookies
        access_token = response.data.get('access')
        refresh_token = response.data.get('refresh')

        response.set_cookie('auth_token', access_token, httponly=True)
        response.set_cookie('refresh_token', refresh_token, httponly=True)

        return response

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            refresh = serializer.validated_data.get('refresh')
            access_token = str(refresh)
            response_data = {
                "success": True,
                "access_token": access_token,
            }
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
