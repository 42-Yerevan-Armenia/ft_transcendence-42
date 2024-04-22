from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError
from django.core.validators import validate_slug, validate_email
from django.contrib.auth.password_validation import validate_password
from django.http import JsonResponse
from django.core.mail import send_mail
import secrets

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

def generate_numeric_token(length):
    return ''.join(str(secrets.randbelow(10)) for _ in range(length))

def send_confirmation_email(email):
    five_digits = generate_numeric_token(5)
    subject = 'Confirm Your Email Address'  
    message = f'Hi, Please confirm your email address by entering the code: {five_digits}'
    from_email = 'avanesvh@gmail.com'
    recipient_list = [email]
    send_mail(subject, message, from_email, recipient_list, fail_silently=False)
    print(five_digits)
    return five_digits

def register_validation(data):
    password = data['password']
    nickname = data['nickname'].strip()
    name = data['name'].strip()
    if not password:
        raise ValidationError('Waiting for a password')
    try:
        validate_password(password)
    except ValidationError:
        raise ValidationError('Invalid password format')

    if not nickname:
        raise ValidationError('Waiting for a nickname')
    if UserModel.objects.filter(username=nickname).exists():
        raise ValidationError('Nickname already exists')
    if not name:
        raise ValidationError('Waiting for a name')
    try:
        validate_slug(name)
    except ValidationError:
        raise ValidationError('Invalid name format')

def password_validation(new_password):
    if not new_password:
        raise ValidationError('Waiting for a new password')
    try:
        validate_password(new_password)
    except ValidationError as e:
        raise ValidationError(e.messages)
    return new_password
