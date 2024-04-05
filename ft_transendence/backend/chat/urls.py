from django.contrib import admin
from django.urls import path
from chat.views import chat_box

# урлы для чата, который сейчас работает
urlpatterns = [
    path("chat/<str:chat_box_name>/", chat_box, name="chat"),
]