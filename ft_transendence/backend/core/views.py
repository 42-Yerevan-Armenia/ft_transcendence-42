from rest_framework import generics
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from .serializers import UserSerializer
from django.core.serializers import serialize
from django.http import JsonResponse
import json

class UserAPIView(APIView):
    def get(self, request):
        queryset = Profile.objects.all()
        serializer = UserSerializer(queryset, many=True)
        data = json.loads(request.body)
        alo = data['alo']
        print(alo)
        return Response(serializer.data)
    
    def post(self, request):
        data = json.loads(request.body)
        return Response(data)
    
    def delete(self, request):
        data = {'message': 'Hello, world! This is delete request!'}
        return Response(data)

class EmailValidation(APIView):
     def post(self, request):
        if request.method == "POST":
            data = json.loads(request.body)
            email = data['email']
            return Response({"message": "Error: server can't find the request resource"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"check": "true", "message" : "recived user confirmed"})


class RegisterAPIView(APIView):
     def post(self, request):
        return Response({"lol": "lol"})
