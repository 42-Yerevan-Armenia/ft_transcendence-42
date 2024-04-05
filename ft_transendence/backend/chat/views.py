from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from friendship.models import Friend

# @login_required
def index(request):
    friends = Friend.objects.friends(request.user)
    return render(request, 'chat/index.html', {'friends': friends})

# @login_required
def room(request, user_id):
    return render(request, 'chat/room.html', {'user_id': user_id})


from django.shortcuts import render

# это из туториала по чату, который сейчас работает
def chat_box(request, chat_box_name):
    # we will get the chatbox name from the url
    return render(request, "chatbox.html", {"chat_box_name": chat_box_name})