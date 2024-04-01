from django.urls import path

from user_api import views

urlpatterns = [
    path('api/v1/login/', views.Login42.as_view()),
    path('api/v1/me/', views.IntraMe.as_view()),
    path('api/v1/callback/', views.IntraCallback.as_view())
]