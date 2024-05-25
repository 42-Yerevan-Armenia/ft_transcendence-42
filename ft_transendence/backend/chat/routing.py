from channels.routing import ProtocolTypeRouter, URLRouter  # Импорт роутера для определения протокола
from channels.auth import AuthMiddlewareStack  # Middleware для аутентификации в Channels
from django.urls import path, re_path  # Импорт функции re_path для определения URL-шаблонов
from chat import consumers  # Импорт консьюмера для WebSocket

# Определение URL-шаблонов для WebSocket
websocket_urlpatterns = [
	path("" , consumers.ChatConsumer.as_asgi()) , 
    re_path(
        r"ws/chat/(?P<chatId>\w+)/$",  # URL-шаблон для WebSocket с chatId в качестве переменной
        consumers.ChatRoomConsumer.as_asgi()  # Консьюмер для обработки WebSocket соединения
    ),
]
