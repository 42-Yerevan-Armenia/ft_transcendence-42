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
from .serializers import (
    UserSerializer,
    SettingsSerializer,
    HomeSerializer,
    LederboardSerializer,
    ProfileSerializer,
    JoinListSerializer,
    WaitingRoomSerializer,
    HistorySerializer,
    FullHistorySerializer,
    GameRoomSerializer
)
from .validations import email_validation, register_validation, send_confirmation_email, password_validation
from .shared_data import shared_data

from friendship.models import FriendshipRequest

from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
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

#TODO: delet by token


class UserAPIView(APIView):
    def get(self, request):
        queryset = Person.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

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
        user = get_user_model().objects.create(
            email=email,
            first_name=request.data['name'],
            username=request.data['nickname'],
            password=hashed_password,
        )
        try:
            data = Person.objects.create(
                user=user,
                email=email,
                name = request.data['name'],
                nickname=request.data['nickname'],
                password=hashed_password,
            )
            data.save_base64_image(image_path=os.path.join(os.path.dirname(__file__), 'default.jpg'))
            data.save_base64_background(background_path=os.path.join(os.path.dirname(__file__), 'background.jpg'))
            # model_to_dict(data)
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
        confirm_data = {
            'email': email,
            'code': code,
            'timestamp': timezone.now().isoformat(),
        }
        shared_data['confirm_data'] = confirm_data
        return JsonResponse({"success": "true", "email": "model_to_dict(data)"})

class ForgetConfirmation(APIView):
    def post(self, request):
        confirm_front = request.data['code']
        if not confirm_front:
            return JsonResponse({"success": "false", "error": "Confirmation code not found"}, status=status.HTTP_400_BAD_REQUEST)
        confirmation_data = shared_data.get('confirm_data')
        if not confirmation_data:
            return JsonResponse({"success": "false", "error": "Confirmation data not found"}, status=status.HTTP_400_BAD_REQUEST)
        confirm_back = confirmation_data['code']
        timer_str = confirmation_data['timestamp']
        timer = timezone.datetime.fromisoformat(timer_str)
        expiration_time = timer + timezone.timedelta(seconds=30)
        if timezone.now() > expiration_time:
            shared_data.pop('confirm_data', None)
            return JsonResponse({"success": "false", "error": "Confirmation code expired"}, status=status.HTTP_408_REQUEST_TIMEOUT)
        if confirm_front != confirm_back:
            return JsonResponse({"success": "false", "error": "Invalid confirmation code"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "message": "Email is validated"})

class Password(APIView):
    def post(self, request):
        confirmation_data = shared_data.get('confirm_data', {})
        if not confirmation_data:
            return JsonResponse({"success": "false", "error": "Confirmation data not found"}, status=status.HTTP_400_BAD_REQUEST)
        shared_data.pop('confirm_data', None)
        email = request.data['email'].strip()
        data_email = confirmation_data.get('email')
        if email != data_email:
            return JsonResponse({"success": "false", "error": "Email is not validated"}, status=status.HTTP_400_BAD_REQUEST)
        password = request.data['password'][10:-10]
        try:
            password = password_validation(password)
            try:
                person = Person.objects.get(email=email)
            except Person.DoesNotExist:
                return JsonResponse({"success": "false", "error": "Person not found"}, status=status.HTTP_404_NOT_FOUND)
            try:
                validate_password(password)
            except ValidationError as e:
                return JsonResponse({"success": "false", "error": e.message}, status=status.HTTP_400_BAD_REQUEST)
            hashed_password = make_password(password)
            person.password = hashed_password
            person.save()
            return JsonResponse({"success": "true", "message": "Password successfully updated"})
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
                    "email": user.email,
                    "image" : user.image
                }
            }
            return JsonResponse({"success": "true", "data": response_data})
        else:
            return JsonResponse({"success": "false", "error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class Profile(APIView):
    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = ProfileSerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        return Response(serializer.data)

class SettingsById(APIView):
    # authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = SettingsSerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)

    def put(self, request, pk):
        try:
            user = Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        data = json.loads(request.body)
        user.name = data.get('name', user.name)
        user.nickname = data.get('nickname', user.nickname)
        user.email = data.get('email', user.email)
        user.image = data.get('image', user.image)
        user.phone = data.get('phone', user.phone)
        user.password = data.get('password', user.password)
        user.gamemode = data.get('gamemode', user.gamemode)
        user.background = data.get('background', user.background)
        user.save()
        return JsonResponse({"success": "true", "profile": model_to_dict(user)})
        
    def delete(self, request, pk):
        try:
            user = Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return JsonResponse({"success": "true", "message": "Person deleted successfully"})

class Lederboard(APIView):

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = LederboardSerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        # return Response(serializer.data)

class GameResult(APIView):

    def post(self, request):
        try:
            # Assuming you receive the user ids and game result (win or lose) in the request data
            user1_id = request.data.get('user1_id')
            user2_id = request.data.get('user2_id')
            result_user1 = request.data.get('result_user1')  # Assuming 1 for win, 0 for lose
            result_user2 = request.data.get('result_user2')
            # Retrieve user objects
            user1 = Person.objects.get(id=user1_id)
            user2 = Person.objects.get(id=user2_id)
            # Update game results
            if result_user1 == 1:
                user1.wins += 1
                score1 = 100
            else:
                user1.loses += 1
                score1 = 50
            if result_user2 == 1:
                user2.wins += 1
                score2 = 100
            else:
                user2.loses += 1
                score2 = 50
            # Update match count
            user1.matches += 1
            user2.matches += 1
            # Set percentage bonus
            win_bonus = 0.5
            lose_bonus = 0.25
            match_bonus = 0.1
            # Calculate points
            points_user1 = ( score1 +
                user1.wins * win_bonus +
                user1.loses * lose_bonus +
                user1.matches * match_bonus
            )
            points_user2 = ( score2 +
                user2.wins * win_bonus +
                user2.loses * lose_bonus +
                user2.matches * match_bonus
            )
            # Update points
            user1.points += points_user1
            user2.points += points_user2
            # Save changes to the database
            user1.save()
            user2.save()
            # Optional: Return updated leaderboard data for both users
            serializer_user1 = LederboardSerializer(user1)
            serializer_user2 = LederboardSerializer(user2)
            return Response({
                "success": "true",
                "user1_profile": serializer_user1.data,
                "user2_profile": serializer_user2.data
            }, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class Home(APIView):

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = HomeSerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        return Response(serializer.data)

class JoinList(APIView):
    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = JoinListSerializer(user)
            if serializer.data['game_room'] == None:
                return JsonResponse({"success": "false", "error": "Game room not found"}, status=status.HTTP_404_NOT_FOUND)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs):
        try:
            players = request.data.get('number')
            live = request.data.get('live')
            theme = request.data.get('theme')
            gamemode = request.data.get('gamemode')
            creator_id = request.user.id

            game_room_data = {
                'max_players': players,
                'live': live,
                'theme': theme,
                'gamemode': gamemode,
                'creator': creator_id
            }
            print(game_room_data)
            game_room_serializer = GameRoomSerializer(data=game_room_data)
            if game_room_serializer.is_valid():
                game_room_serializer.save()
                return JsonResponse({"success": "true", "message": "Game room created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return JsonResponse({"success": "false", "error": game_room_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"success": "false", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class WaitingRoom(APIView):

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = WaitingRoomSerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        return Response(serializer.data)

class History(APIView):

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = HistorySerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        return Response(serializer.data)

class FullHistory(APIView):

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = FullHistorySerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        return Response(serializer.data)

class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            refresh_token = serializer.validated_data.get('refresh')
            refresh = RefreshToken(refresh_token)
            access = str(refresh.access_token)
            new_refresh = str(refresh)
            response_data = {
                "success": True,
                "access": access,
                "refresh": new_refresh,
            }
            return JsonResponse({"success": "true", "data": response_data}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#FIXME: friend request

class SendFriendRequest(APIView):
    def post(self, request, *args, **kwargs):
        try:
            sender = request.user  # Assuming sender is the authenticated user
            receiver_id = request.data.get('receiver_id')
            receiver = Person.objects.get(id=receiver_id).user

            # Check if a friendship request already exists
            if not FriendshipRequest.objects.filter(from_user=sender, to_user=receiver).exists():
                # Create a new friendship request
                FriendshipRequest.objects.create(from_user=sender, to_user=receiver)

                return Response({"success": "true", "message": "Friend request sent"}, status=status.HTTP_201_CREATED)
            else:
                return Response({"success": "false", "error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Receiver user not found"}, status=status.HTTP_404_NOT_FOUND)

class AcceptFriendRequest(APIView):
    def post(self, request, *args, **kwargs):
        try:
            receiver = request.user  # Assuming receiver is the authenticated user
            sender_id = request.data.get('sender_id')
            sender = Person.objects.get(id=sender_id).user

            # Check if a friendship request exists
            friendship_request = FriendshipRequest.objects.filter(from_user=sender, to_user=receiver, status='pending').first()
            if friendship_request:
                # Accept the friendship request
                friendship_request.accept()

                return Response({"success": "true", "message": "Friend request accepted"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": "false", "error": "Friend request not found or already accepted"}, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Sender user not found"}, status=status.HTTP_404_NOT_FOUND)