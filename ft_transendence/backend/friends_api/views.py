from django.http import JsonResponse
from django.shortcuts import render
from django.utils import timezone
from friendship.models import Friend, FriendshipRequest, Block
from core.serializers import FriendSerializer
from core.models import User, Person
from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import TokenAuthentication

class SendFriendRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            sender = request.user
            receiver_id = request.data.get('receiver_id')
            receiver = Person.objects.get(id=receiver_id).user

            # Check if the sender is banned
            if Block.objects.is_blocked(sender, receiver) == True:
                return Response({"success": "false", "error": "You are banned by this user"}, status=status.HTTP_400_BAD_REQUEST)
            # Check if the receiver is friends with the sender
            if Friend.objects.are_friends(sender, receiver):
                return Response({"success": "false", "error": "You are already friends with this user"}, status=status.HTTP_400_BAD_REQUEST)
            # Check if a friendship request already exists
            existing_request = FriendshipRequest.objects.filter(from_user=sender, to_user=receiver).first()
            if existing_request:
                # If the existing request was rejected, delete it so a new one can be sent
                if existing_request.rejected:
                    existing_request.delete()
                else:
                    return Response({"success": "false", "error": "Friend request already sent"}, status=status.HTTP_400_BAD_REQUEST)
            # Create a new friendship request
            FriendshipRequest.objects.create(from_user=sender, to_user=receiver)
            return Response({"success": "true", "message": "Friend request sent"}, status=status.HTTP_201_CREATED)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Receiver user not found"}, status=status.HTTP_404_NOT_FOUND)

class AcceptFriendRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            receiver = request.user
            sender_id = request.data.get('sender_id')
            sender = Person.objects.get(id=sender_id).user
            # Check if a friendship request exists
            friendship_request = FriendshipRequest.objects.filter(from_user=sender, to_user=receiver).first()
            if friendship_request:
                friendship_request.accept()# Accept the friendship request
                return Response({"success": "true", "message": "Friend request accepted"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": "false", "error": "Friend request not found or already accepted"}, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Sender user not found"}, status=status.HTTP_404_NOT_FOUND)

class RejectFriendRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            receiver = request.user
            sender_id = request.data.get('sender_id')
            sender = Person.objects.get(id=sender_id).user
            # Check if a friendship request exists
            friendship_request = FriendshipRequest.objects.filter(from_user=sender, to_user=receiver).first()
            if friendship_request:
                friendship_request.reject()# Reject the friendship request
                return Response({"success": "true", "message": "Friend request rejected"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": "false", "error": "Friend request not found or already rejected"}, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Sender user not found"}, status=status.HTTP_404_NOT_FOUND)

class DeleteFriend(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            sender = request.user
            friend_id = request.data.get('friend_id')
            friend = Person.objects.get(id=friend_id).user

            # Check if the friendship exists
            friendship = Friend.objects.are_friends(sender, friend)
            if friendship:
                return Response({"success": "true", "message": "Are you sure you want to delete this friend?"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": "false", "error": "Friendship not found"}, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    permission_classes = [IsAuthenticated]
    def delete(self, request, *args, **kwargs):
        try:
            sender = request.user
            friend_id = request.data.get('friend_id')
            friend = Person.objects.get(id=friend_id).user

            # Check if the friendship exists
            friendship = Friend.objects.are_friends(sender, friend)
            friend1 = Friend.objects.get(from_user=sender, to_user=friend)
            friend2 = Friend.objects.get(from_user=friend, to_user=sender)
            if friendship:
                friend1.delete()
                friend2.delete()
                return Response({"success": "true", "message": "Friend deleted successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": "false", "error": "Friendship not found or already deleted"}, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

class BlockRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            sender = request.user
            receiver_id = request.data.get('receiver_id')
            receiver = Person.objects.get(id=receiver_id).user
            # Check if the sender is already blocked by the receiver
            if Block.objects.is_blocked(receiver, sender):
                return Response({"success": "false", "error": "You are already blocked by this user"}, status=status.HTTP_400_BAD_REQUEST)
            # Check if the sender is friends with the receiver
            if Friend.objects.are_friends(sender, receiver): # If they are friends, delete the friendship
                Friend.objects.remove_friend(sender, receiver)
            # Create a new block
            Block.objects.add_block(sender, receiver)
            return Response({"success": "true", "message": "User blocked successfully"}, status=status.HTTP_201_CREATED)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Receiver user not found"}, status=status.HTTP_404_NOT_FOUND)

class UnblockRequest(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, *args, **kwargs):
        try:
            sender = request.user
            receiver_id = request.data.get('receiver_id')
            receiver = Person.objects.get(id=receiver_id).user
            # Check if the sender is blocked by the receiver
            if Block.objects.is_blocked(sender, receiver):
                Block.objects.remove_block(sender, receiver)
                return Response({"success": "true", "message": "User unblocked successfully"}, status=status.HTTP_200_OK)
            else:
                return Response({"success": "false", "error": "Receiver are not blocked"}, status=status.HTTP_400_BAD_REQUEST)
        except Person.DoesNotExist:
            return Response({"success": "false", "error": "Receiver user not found"}, status=status.HTTP_404_NOT_FOUND)

class Friendlist(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request, pk):
        try:
            user = User.objects.get(id=pk)
            friends = Friend.objects.friends(user)
            friend_ids = [friend.id for friend in friends]
            return JsonResponse({"success": True, "friend_ids": friend_ids}, status=status.HTTP_200_OK)
        except User.DoesNotExist:
            return JsonResponse({"success": False, "error": "User not found"}, status=status.HTTP_404_NOT_FOUND)