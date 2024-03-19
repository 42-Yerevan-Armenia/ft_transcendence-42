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
    Home,
    Profile,
    JoinList,
    WaitingRoom,
    History,
    FullHistory,
    SendFriendRequest,
    AcceptFriendRequest,
    RejectFriendRequest,
    DeleteFriend,
    Lederboard,
    CreateRoom,
    GameRoom,
    GameResult,
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

    path('api/v1/home/<int:pk>/', Home.as_view()),
    path('api/v1/profile/<int:pk>/', Profile.as_view()),
    path('api/v1/lederboard/<int:pk>/', Lederboard.as_view()),
    path('api/v1/joinlist/<int:pk>/', JoinList.as_view()),
    path('api/v1/waitingroom/<int:pk>/', WaitingRoom.as_view()),
    path('api/v1/history/<int:pk>/', History.as_view()),
    path('api/v1/fullhistory/<int:pk>/', FullHistory.as_view()),
    path('api/v1/settings/<int:pk>/', SettingsById.as_view()),

    path('gameresult/', GameResult.as_view()),
    path('api/v1/createroom/<int:pk>/', CreateRoom.as_view()),
    path('api/v1/gameroom/<int:pk>/', GameRoom.as_view()),
    # path('gameroom/', GameRoom.as_view()),

    path('api/v1/send/<int:pk>/', SendFriendRequest.as_view()),
    path('api/v1/accept/<int:pk>/', AcceptFriendRequest.as_view()),
    path('api/v1/reject/<int:pk>/', RejectFriendRequest.as_view()),
    path('api/v1/delete/<int:pk>/', DeleteFriend.as_view()),
]
