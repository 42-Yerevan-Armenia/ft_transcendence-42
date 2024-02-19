from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Person as Profile
from .serializers import UserSerializer, EmailSerializer
from .validations import email_validation, register_validation, send_confirmation_email
from .shared_data import shared_data

from django.core.exceptions import ValidationError
from django.core.serializers import serialize
from django.forms.models import model_to_dict
from django.http import JsonResponse
from django.utils import timezone
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
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data = Profile.objects.create(
                email=email,
                nickname=request.data['nickname'],
                password=request.data['password'],
                name = request.data['name'])
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=500)
        return JsonResponse({"success": "true", "reg": model_to_dict(data)})
