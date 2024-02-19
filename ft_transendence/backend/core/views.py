from rest_framework import generics, status, viewsets
from rest_framework.views import APIView
from rest_framework.response import Response

from .models import Person as Profile
from .serializers import UserSerializer, EmailSerializer
from .validations import email_validation, register_validation
from .sendemail import email_send_func

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
        print("ok 0+++++")
        email = request.data['email'].strip()
        print("ok 1")
        try:
            email_validation(email)
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        request.session['email'] = email
        request.session.save()
        print("ok 2")
        email_send_func(email)
        print("ok 3")
        return JsonResponse({"success": "true", "email": "model_to_dict(data)"})

class Register(APIView):
    def post(self, request):
        email = request.session['email']
        request.session.delete()
        if not email:
            return JsonResponse({"success": "false","error": "Email is not validated"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            register_validation(request.data)
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=status.HTTP_400_BAD_REQUEST)
        try:
            data = Profile.objects.create(email=email, nickname=request.data['nickname'], password=request.data['password'], name = request.data['name'])
        except ValidationError as e:
            return JsonResponse({"success": "false","error": e.message}, status=500)
        return JsonResponse({"success": "true", "reg": model_to_dict(data)})

