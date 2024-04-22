from django.urls import path, include
from chat import views as chat_views
from . import consumers  # Импорт consumers (для WebSocket)
from django.contrib.auth.views  import LoginView, LogoutView


urlpatterns = [
    path("chat-page/", chat_views.chatPage, name="chat-page"),
    # login-section
    path("auth/login/", LoginView.as_view(template_name="LoginPage.html"), name="login-user"),
    path("auth/logout/", LogoutView.as_view(), name="logout-user"),

    path('chat/<int:chat_id>/', chat_views.chat_detail, name='chat_detail'),  # URL для просмотра деталей чата
    path('friend_list/', chat_views.friend_list, name='friend_list'),  # URL для отображения списка друзей
    path('start_chat/', chat_views.start_chat, name='start_chat'),  # URL для начала нового чата
]
