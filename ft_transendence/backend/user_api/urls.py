from django.urls import path

from user_api import views

urlpatterns = [
    path('api/v1/login/', views.Login42.as_view()),
]