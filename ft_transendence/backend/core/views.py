from rest_framework import generics
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Profile
from .serializers import UserSerializer
from django.core.serializers import serialize
from django.http import JsonResponse

class UserAPIView(APIView):
    def get(self, request):
        queryset = Profile.objects.all()
        serializer = UserSerializer(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        data = {'message': 'Hello, world! This is post request!'}
        return Response(data)
    
    def delete(self, request):
        data = {'message': 'Hello, world! This is delete request!'}
        return Response(data)

