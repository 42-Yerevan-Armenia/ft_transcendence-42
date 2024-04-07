from django.shortcuts import render, redirect
from django.http import HttpResponseRedirect
from django.urls import reverse
from .models import Chat  # Импорт модели чата
from django.contrib.auth.models import User
from friendship.models import Friend

def chatPage(request, *args, **kwargs):
	if not request.user.is_authenticated:
		return redirect("login-user")
	context = {}
	return render(request, "chatPage.html", context)

# Просмотр деталей чата
def chat_detail(request, chat_id):
    # Получаем чат по идентификатору
    chat = Chat.objects.get(id=chat_id)
    
    # Проверяем, что текущий пользователь участвует в чате
    if request.user in chat.participants.all():
        return render(request, 'chat_detail.html', {'chat': chat, 'chat_id': chat_id})  # передача chat_id в контекст
    else:
        return redirect('friend_list')  # Если пользователь не участвует в чате, перенаправляем его на список друзей

# Список друзей пользователя
def friend_list(request):
    user = request.user
    friends = Friend.objects.friends(user)  # Получаем список друзей пользователя
    return render(request, 'friend_list.html', {'friends': friends})  # Отображаем список друзей

# Начать новый чат
def start_chat(request):
    if request.method == 'POST':  # Если запрос POST
        friend_username = request.POST.get('friend_username')  # Получаем имя друга из формы
        friend = User.objects.get(username=friend_username)  # Находим пользователя по имени
        # Создаем чат или получаем существующий чат
        chat = Chat.get_or_create_chat(request.user, friend)
        # Перенаправляем пользователя на страницу чата с уникальным идентификатором чата
        return redirect('chat_detail', chat_id=chat.id)
    return redirect('friend_list')  # Если метод запроса не POST, перенаправляем пользователя на список друзей
