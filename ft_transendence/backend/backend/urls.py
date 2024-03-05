"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings
from core.views import (
    UserAPIView, 
    EmailValidation, 
    Confirmation, 
    Register, 
    Password,
    PasswordReset,
    ForgetConfirmation,
    Login,
    ProfileById,
    TokenView,
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/userlist/', UserAPIView.as_view()),
    path('api/v1/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/v1/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/v1/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('token/', TokenView.as_view(), name='token_obtain_pair'),

    path('email_validation/', EmailValidation.as_view()),
    path('confirm/', Confirmation.as_view()),
    path('register/', Register.as_view()),
    path('password_reset/', PasswordReset.as_view()),
    path('forget_confirm/', ForgetConfirmation.as_view()),
    path('password/', Password.as_view()),
    path('login/', Login.as_view()),
    path('api/v1/profile/<int:pk>/', ProfileById.as_view()),

    path("", include("chat.urls")),
]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT,
    )
