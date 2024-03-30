from django.urls import path

from game import views as game_views
from game.views import PlayRandom, PlayTournament, GameResult

urlpatterns = [
    path('game/', game_views.index, name='index'),
    path('tournament/', PlayTournament.as_view()),
    path('gameresult/', GameResult.as_view()),
    path('api/v1/random/<int:pk>/', PlayRandom.as_view()),
]