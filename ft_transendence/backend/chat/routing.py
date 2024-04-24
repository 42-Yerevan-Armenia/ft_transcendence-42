from chat.consumers import ChatConsumer

from channels.auth import AuthMiddlewareStack  # Middleware для аутентификации в Channels
from channels.routing import ProtocolTypeRouter, URLRouter  # Импорт роутера для определения протокола
from django.urls import path, re_path  # Импорт функции re_path для определения URL-шаблонов
from chat import consumers  # Импорт консьюмера для WebSocket

# Here, "" is routing to the URL ChatConsumer which 
# will handle the chat functionality.
# Определение URL-шаблонов для WebSocket
websocket_urlpatterns = [
	path("" , ChatConsumer.as_asgi()) , 
    re_path(
        r"ws/chat/(?P<chatId>\w+)/$",  # URL-шаблон для WebSocket с chatId в качестве переменной
        consumers.ChatRoomConsumer.as_asgi()  # Консьюмер для обработки WebSocket соединения
    ),
]
