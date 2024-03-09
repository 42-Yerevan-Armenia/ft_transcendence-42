# перенаправит DjangoApp на другие views в приложении

from django.urls import path, include
from core import views as core_views
from core.views import (
    EmailValidation, 
    Confirmation, 
    Register, 
    Password,
    PasswordReset,
    ForgetConfirmation,
    Login,
    SettingsById
)

urlpatterns = [
    path('email_validation/', EmailValidation.as_view()),
    path('confirm/', Confirmation.as_view()),
    path('register/', Register.as_view()),
    path('password_reset/', PasswordReset.as_view()),
    path('forget_confirm/', ForgetConfirmation.as_view()),
    path('password/', Password.as_view()),
    path('login/', Login.as_view()),
    path('api/v1/settings/<int:pk>/', SettingsById.as_view()),
]

