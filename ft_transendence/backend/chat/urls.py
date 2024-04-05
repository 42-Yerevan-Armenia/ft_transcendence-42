from django.contrib import admin
from django.urls import path
from . import consumers  # Импорт consumers (для WebSocket)
from chat.views import start_chat  # Импорт функции начала чата
from chat.views import chat_detail  # Импорт функции просмотра деталей чата
from chat.views import friend_list  # Импорт функции отображения списка друзей

# Определение URL-шаблонов приложения chat
urlpatterns = [
    path('chat/<int:chat_id>/', chat_detail, name='chat_detail'),  # URL для просмотра деталей чата
    path('friends/', friend_list, name='friend_list'),  # URL для отображения списка друзей
    path('start_chat/', start_chat, name='start_chat'),  # URL для начала нового чата
]
