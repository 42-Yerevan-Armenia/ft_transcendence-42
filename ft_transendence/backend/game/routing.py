# from django.urls import path
# from . import consumers

# websocket_urlpatterns = [
#     path("<game>/", consumers.PongConsumer),
# ]


from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('ws/game/', consumers.PongConsumer.as_asgi()),
    path("ws/joinlist/", consumers.joinListConsumer.as_asgi()),
]

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            websocket_urlpatterns
        )
    ),
})