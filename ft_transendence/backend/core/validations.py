from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_slug, validate_email
from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse

UserModel = get_user_model()

def email_validation(email):
    if not email:
        raise ValidationError('Waiting for an email address') 
    try:
        validate_email(email)
    except ValidationError:
        raise ValidationError('Invalid email format')
    if UserModel.objects.filter(email=email).exists():
        raise ValidationError('Email already exists')

def register_validation(data):
    password = data['password']
    nickname = data['nickname'].strip()
    name = data['nickname']
    if not password:
        raise ValidationError('Waiting for a password')
    try:
        validate_password(password)
    except ValidationError:
        raise ValidationError('Invalid password format')
    if not nickname:
        raise ValidationError('Waiting for a nickname')
    try:
        validate_slug(nickname)
    except ValidationError:
        raise ValidationError('Invalid nickname format')
    if UserModel.objects.filter(username=nickname).exists():
        raise ValidationError('Nickname already exists')

    if not name:
        raise ValidationError('Waiting for a name')
    try:
        validate_slug(name)
    except ValidationError:
        raise ValidationError('Invalid name format')
    if UserModel.objects.filter(username=name).exists():
        raise ValidationError('Name already exists')
    return data

def email_validator(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('Waiting for an email address') 
    return True

def password_validator(data):
    password = data['password']
    if not password:
        raise ValidationError('Waiting for a password')
    return True

def nickname_validator(data):
    nickname = data['nickname'].strip()
    if not nickname:
        raise ValidationError('Waiting for a nickname')
    return True