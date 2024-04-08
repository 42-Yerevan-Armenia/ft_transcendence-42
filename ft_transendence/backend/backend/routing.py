from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import game.routing
import chat.routing


application = ProtocolTypeRouter(
    {
        "websocket": AuthMiddlewareStack(
            URLRouter(
                game.routing.websocket_urlpatterns +
                chat.routing.websocket_urlpatterns
            )
        ),
    }
)
