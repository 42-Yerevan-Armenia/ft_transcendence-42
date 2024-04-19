from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import api_view
from rest_framework.authentication import TokenAuthentication
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import Confirm, Person, GameRoom, History
from game.views import PlayTournament
from .serializers import (
    UserSerializer,
    SettingsSerializer,
    HomeSerializer,
    LeaderboardSerializer,
    ProfileSerializer,
    JoinListSerializer,
    WaitingRoomSerializer,
    HistorySerializer,
    FullHistorySerializer,
    GameRoomSerializer,
    MatchSerializer,
    CustomSerializer
)
from .validations import (
    email_validation,
    register_validation,
    send_confirmation_email,
    password_validation
)

from django.contrib.auth.password_validation import validate_password
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.models import User
from django.contrib.auth import get_user_model
from django.contrib.sessions.models import Session
from django.core.validators import validate_email
from django.core.exceptions import ValidationError, ObjectDoesNotExist
from django.core.files.base import ContentFile
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.utils import timezone

from collections import defaultdict

import json
import time
import base64
import os

#TODO: activate all Tokens

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

class UsersAPIView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        user = Person.objects.get(id=pk)
        if user:
            try:
                serializer = UserSerializer(user)
                return JsonResponse(serializer.data)
            except Person.DoesNotExist:
                return JsonResponse({'error': 'User not found'}, status=404)
        else:
            return JsonResponse({'error': 'User ID not provided'}, status=400)

class EmailValidation(APIView):
    def post(self, request):
        email = request.data['email'].strip()
        try:
            email_validation(email)
            code = send_confirmation_email(email)
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        try:
            existing_confirmation_data = Confirm.objects.get(email=email)
            existing_confirmation_data.delete()  # Delete existing confirmation data
        except ObjectDoesNotExist:
            pass
        confirmation_data = Confirm.objects.create(email=email, code=code)
        return JsonResponse({"success": "true", "email": "model_to_dict(data)"})

class Confirmation(APIView):
    def post(self, request):
        confirm_front = request.data['code']
        if not confirm_front:
            return JsonResponse({"success": "false", "error": "Confirmation code not found"}, status=status.HTTP_400_BAD_REQUEST)
        email = request.data['email']
        try:
            confirmation_data = Confirm.objects.filter(email=email).latest('timestamp')
            expiration_time = confirmation_data.timestamp + timezone.timedelta(seconds=35)
            if timezone.now() > expiration_time:
                confirmation_data.delete()
                return JsonResponse({"success": "false","error": "Confirmation code expired"}, status=status.HTTP_408_REQUEST_TIMEOUT)
            if confirm_front != confirmation_data.code:
                return JsonResponse({"success": "false","error": "Invalid confirmation code"}, status=status.HTTP_404_NOT_FOUND)
        except Confirm.DoesNotExist:
            return JsonResponse({"success": "false","error": "Confirmation data not found"}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({"success": "true", "message": "Email is validated"})

class Register(APIView):
    def post(self, request):
        email = request.data['email']
        try:
            confirmation_data = Confirm.objects.get(email=email)
            confirmation_data.delete()
            register_validation(request.data)
            password = request.data['password'][10:-10]
            hashed_password = make_password(password)
            user = get_user_model().objects.create(
                email=email,
                first_name=request.data['name'],
                username=request.data['nickname'],
                password=hashed_password,
            )
            data = Person.objects.create(
                user=user,
                email=email,
                name=request.data['name'],
                nickname=request.data['nickname'],
                password=hashed_password,
            )
            data.save_base64_image(image_path=os.path.join(os.path.dirname(__file__), 'default.jpg'))
            data.save_base64_background(background_path=os.path.join(os.path.dirname(__file__), 'background.jpg'))
            data_to_send = {'email': email, 'nickname': request.data['nickname'], 'name': request.data['name']}
            return JsonResponse({"success": "true", "reg": data_to_send})
        except Confirm.DoesNotExist:
            return JsonResponse({"success": "false","error": "Email is not validated"}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)

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
            user = User.objects.get(email=email)
            person = Person.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        if check_password(password, person.password):
            person.is_online = True
            person.save()
            token_serializer = TokenObtainPairSerializer()
            token = token_serializer.get_token(user)
            refresh = RefreshToken.for_user(user)

            response_data = {
                "success": "true",
                "access": str(token.access_token),
                "refresh": str(refresh),
                "user": {
                    "id": person.id,
                    "name": person.name,
                    "nickname": person.nickname,
                    "email": person.email,
                    "image": person.image,
                }
            }
            return JsonResponse({"success": "true", "data": response_data})
        else:
            return JsonResponse({"success": "false", "error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

class Logout(APIView):
    def post(self, request, pk):
        person = Person.objects.get(id=pk)
        person.is_online = False
        person.save()
        return Response({"success": "true", "message": "Logged out successfully"}, status=status.HTTP_200_OK)

class Profile(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = ProfileSerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)

class SettingsById(APIView):
    # authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = SettingsSerializer(user)
            return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def put(self, request, pk):
        try:
            user = Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        data = json.loads(request.body)
        print("❌", data)
        if 'name' in data and data['name']:
            user.name = data['name']
        if 'nickname' in data and data['nickname']:
            user.nickname = data['nickname']
        if 'email' in data and data['email']:
            user.email = data['email']
        # image_file = request.FILES.get('image')
        # print("❎", image_file)
        if 'image' in data and data['image']:
            # image_path = data['image']
            # Read the image file
            # with open(image_path, "rb") as img_file:
                # Encode the image to base64
                # base64_image = base64.b64encode(img_file.read()).decode('utf-8')
            # user.image = base64_image
            user.image = data['image']
        print("✅", user.image)
        new_password = data.get('password')
        if new_password:
            hashed_password = make_password(new_password)
            user.password = hashed_password
        if 'gamemode' in data and data['gamemode']:
            user.gamemode = data['gamemode']
        if 'twofactor' in data and data['twofactor']:
            user.twofactor = bool(data['twofactor'])
        user.save()
        return JsonResponse({"success": "true", "profile": model_to_dict(user)})

    def delete(self, request, pk):
        try:
            user = Person.objects.get(pk=pk)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        user.delete()
        return JsonResponse({"success": "true", "message": "Person deleted successfully"})

class Leaderboard(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = LeaderboardSerializer(user)
            leaderboard_data = {
                "id": user.id,
                "nickname": user.nickname,
                "image": user.image,
                "wins": user.wins,
                "loses": user.loses,
                "matches": user.matches,
                "points": user.points,
            }
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "leaderboard": [leaderboard_data]}, safe=False)

class Home(APIView):

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = HomeSerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        # return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)
        return Response(serializer.data)

class WaitingRoom(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            active_users = User.objects.filter(is_active=True).exclude(id=pk)
            active_persons = [user.person for user in active_users]
            serializer = WaitingRoomSerializer(active_persons, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    def post(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            opponent_id = request.data.get('opponent_id')
            opponent = Person.objects.get(id=opponent_id)
            if opponent.ongoing is not None:
                return JsonResponse({"success": "false", "error": "Opponent is already in a game room"}, status=status.HTTP_400_BAD_REQUEST)
            return Response({"success": "true", "message": "Invitation sent successfully"}, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "User or opponent not found"}, status=status.HTTP_404_NOT_FOUND)

def save_base64_image(image_path):
    with open(image_path, "rb") as img_file:
        return base64.b64encode(img_file.read()).decode('utf-8')

class JoinList(APIView):
    # permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            # Retrieve all persons with their associated game rooms
            persons = Person.objects.exclude(game_room=None).select_related('game_room').order_by('game_room_id')
            game_room_data = defaultdict(list) # Group persons by game_room_id
            for person in persons:
                game_room_data[person.game_room_id].append(person)
            # Construct JSON response
            result = {"success": True, "game_rooms": []}
            for game_room_id, persons_in_room in game_room_data.items():
                # Ensure there are at least two persons in the room
                if len(persons_in_room) >= 1:
                    # Get the associated game room
                    game_room = persons_in_room[0].game_room
                    if len(persons_in_room) <= 2 and game_room.max_players <= 2:
                        room_data = {
                            "id": game_room_id,
                            "creator_id": game_room.creator_id,
                            "src": [],
                            "GameLevele": game_room.gamemode,
                            "current_players": len(persons_in_room),
                            "max_players": game_room.max_players,
                            "isJoin": game_room.ongoing,
                        }
                        if len(persons_in_room) == 2:
                            room_data["src"].append({
                                "url": persons_in_room[0].image,
                                "urlClient": persons_in_room[1].image
                            })
                        else:
                            # Add image for the first player and default image for the second player if he is not in the room
                            default = os.path.join(os.path.dirname(__file__), 'default.jpg')
                            default_img = save_base64_image(default)
                            room_data["src"].append({
                                "url": persons_in_room[0].image,
                                "urlClient": default_img  # Replace with your default image URL
                            })
                        room_data["type"] = "User"
                    else:
                        # Add only player IDs when there are not exactly two players
                        cup = os.path.join(os.path.dirname(__file__), 'cup.jpg')
                        cup_img = save_base64_image(cup)
                        room_data = {
                            "id": game_room_id,
                            "creator_id": game_room.creator_id,
                            "src": cup_img,
                            "GameLevele": "Tournament",
                            "current_players": len(persons_in_room),
                            "max_players": game_room.max_players,
                            "isJoin": game_room.ongoing,
                            "type": "Tournament"
                        }
                    # Add the game room data to the result
                    result["game_rooms"].append(room_data)
            return JsonResponse(result)
        except User.DoesNotExist:
            return JsonResponse({"success": False, "error": "No game rooms found"})

    def post(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            creator_id = request.data.get('creator_id')
            game_room_id = request.data.get('game_room_id')
            try:
                creator = Person.objects.get(id=creator_id)
                game_room = creator.game_room
            except Person.DoesNotExist:
                return JsonResponse({"success": "false", "error": "Creator not found"}, status=status.HTTP_404_NOT_FOUND)
            if creator.ongoing:
                return JsonResponse({"success": "false", "error": "User is already in a game room"}, status=status.HTTP_400_BAD_REQUEST)
            if game_room.is_full():
                if user in game_room.players.all():
                    return JsonResponse({"success": "false", "error": "You already have a game room"}, status=status.HTTP_400_BAD_REQUEST)
                else:
                    PlayTournament().post(request, game_room_id=game_room_id, creator_id=creator_id)
                    return JsonResponse({"success": "true", "error": "Game room is full"}, status=status.HTTP_400_BAD_REQUEST)
            else:
                game_room.players.add(user)
                game_room.save()
                user.game_room = game_room
                user.save()
                creator.save()
                # Check if the game room is now full after adding the user
                if game_room.is_full():
                    PlayTournament().post(request, game_room_id=game_room_id, creator_id=creator_id)
                    game = {
                        'creator_id': creator_id,
                        'game_room_id': game_room_id
                    }
                    return JsonResponse({"success": "true", "game": game, "message": "Successfully joined the game room. Game will start soon."}, status=status.HTTP_200_OK)
                else:
                    return JsonResponse({"success": "true", "message": "Successfully joined the game room"}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"success": "false", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CreateRoom(APIView):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]
    def post(self, request, pk):
        try:
            creator = Person.objects.get(id=pk)
            if creator.game_room:
                return JsonResponse({"success": "false", "error": "User already has a game room"}, status=status.HTTP_400_BAD_REQUEST)
            max_players = request.data.get('max_players', 2)
            if max_players == '':
                max_players = 2
            else:
                max_players = int(max_players)
            live = request.data.get('live', "false")
            if live == '':
                live = "false"
            theme = request.data.get('theme', "dark").lower()
            if theme == '':
                theme = "dark"
            gamemode = request.data.get('gamemode', "classic").lower()
            if gamemode == '':
                gamemode = "classic"
            game_room_data = {
                'max_players': max_players,
                'live': live,
                'theme': theme,
                'gamemode': gamemode,
                'creator': creator.id,
                'players': [creator.id],
                'is_tournament': max_players > 2,
            }
            game_room_serializer = GameRoomSerializer(data=game_room_data)
            if game_room_serializer.is_valid():
                game_room = game_room_serializer.save()
                creator.game_room = game_room
                creator.save()
                return JsonResponse({"success": "true", "message": "Game room created successfully"}, status=status.HTTP_201_CREATED)
            else:
                return JsonResponse({"success": "false", "error": game_room_serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return JsonResponse({"success": "false", "error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GameRoom(APIView):
    def post(self, request, pk):
        # Logic to handle game room invitation
        # Send invitation/notification to UserB
        # Wait for UserB's response (Accept/Ignore)
        user_response = request.data.get('response')

        if user_response == "Accept":
            game_room = Person.objects.get(id=pk).game_room
            game_room.ongoing = True
            game_room.save()
            # Set ongoing to True for all players in the game room
            for player in game_room.players.all():
                player.ongoing = True
                player.save()
            # Start the game application
            return JsonResponse({"success": "true", "message": "Game will start soon."}, status=status.HTTP_200_OK)
        elif user_response == "Ignore":
            # No changes needed
            return JsonResponse({"success": "true", "message": "Invitation ignored."}, status=status.HTTP_200_OK)
        else:
            return JsonResponse({"success": "false", "error": "Invalid response"}, status=status.HTTP_400_BAD_REQUEST)

class HistoryView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            history_data = History.objects.filter(player=user)
            serializer = HistorySerializer(history_data, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Person.DoesNotExist:
            return JsonResponse({"success": False, "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class FullHistoryView(APIView):

    def get(self, request, pk):
        try:
            user = Person.objects.get(id=pk)
            serializer = FullHistorySerializer(user)
        except Person.DoesNotExist:
            return JsonResponse({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        return JsonResponse({"success": "true", "profile": serializer.data}, safe=False)

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
