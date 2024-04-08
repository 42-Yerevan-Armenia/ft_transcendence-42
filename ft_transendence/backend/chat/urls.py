from django.urls import path, include
from chat import views as chat_views
from . import consumers  # Импорт consumers (для WebSocket)


urlpatterns = [
	path("chat/", chat_views.chatPage, name="chat-page"),

    path('chat/<int:chat_id>/', chat_views.chat_detail, name='chat_detail'),  # URL для просмотра деталей чата
    # path('friends/', chat_views.friend_list, name='friend_list'),  # URL для отображения списка друзей
    path('start_chat/', chat_views.start_chat, name='start_chat'),  # URL для начала нового чата
]
