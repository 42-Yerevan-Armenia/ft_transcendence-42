from django.urls import path, include
from friends_api import views as friends_api_views
from friends_api.views import (
    SendFriendRequest,
    AcceptFriendRequest,
    RejectFriendRequest,
    DeleteFriend,
    BlockRequest,
    UnblockRequest
)

urlpatterns = [
    path('api/v1/send/<int:pk>/', SendFriendRequest.as_view()),
    path('api/v1/accept/<int:pk>/', AcceptFriendRequest.as_view()),
    path('api/v1/reject/<int:pk>/', RejectFriendRequest.as_view()),
    path('api/v1/delete/<int:pk>/', DeleteFriend.as_view()),
    path('api/v1/block/<int:pk>/', BlockRequest.as_view()),
    path('api/v1/unblock/<int:pk>/', UnblockRequest.as_view()),
]