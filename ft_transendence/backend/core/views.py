from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Profile
from .serializers import UserSerializer, EmailSerializer
from .validations import nickname_validator, email_validator, password_validator
from .validations import email_validation, register_validation
from django.core.exceptions import ValidationError
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.http import JsonResponse
import json

class UserAPIView(APIView):
    def get(self, request):
        queryset = Profile.objects.all()
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
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        return JsonResponse({"success": "true", "email": "model_to_dict(data)"})
