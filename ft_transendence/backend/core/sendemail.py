from django.core.mail import send_mail
from django.conf import settings

subject = 'Subject Here'
message = 'Here is the message.  [12345] '
from_email = settings.EMAIL_HOST_USER


def email_send_func(email):
    send_mail(subject, message, from_email, [email])
