from django.db import models
from django.contrib.auth.models import User
from friendship.models import Friend

class Chat(models.Model):
    date_created = models.DateTimeField(auto_now_add=True)  # Дата и время создания чата
    participants = models.ManyToManyField(User, related_name='chats')  # Участники чата

    @staticmethod
    def get_or_create_chat(user1, user2):
        # Проверяем существующий чат между пользователями
        chat = Chat.objects.filter(participants=user1).filter(participants=user2).first()

        if not chat:
            # Создаем новый чат, если не существует
            chat = Chat.objects.create()
            chat.participants.add(user1, user2)  # Добавляем пользователей в чат

        return chat  # Возвращаем существующий или новый чат
