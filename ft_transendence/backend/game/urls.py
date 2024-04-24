from django.urls import path

from game import views as game_views
from game.views import (
    PlayRandom,
    PlayTournament,
    SendInviteRequest,
    AcceptInviteRequest,
    RejectInviteRequest
)

urlpatterns = [
    path('game/', game_views.index, name='index'),
    path('joinlist/', game_views.joinlist, name='joinlist'),
    path('tournament/', PlayTournament.as_view()),
    path('api/v1/random/<int:pk>/', PlayRandom.as_view()),
    path('api/v1/invite/<int:pk>/', SendInviteRequest.as_view()),
    path('api/v1/acceptinvite/<int:pk>/', AcceptInviteRequest.as_view()),
    path('api/v1/rejectinvite/<int:pk>/', RejectInviteRequest.as_view()),
]