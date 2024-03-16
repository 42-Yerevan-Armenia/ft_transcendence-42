from django.shortcuts import render
# from . import app

def index(request):
    # app.game()
    return render(request, 'index.html')
