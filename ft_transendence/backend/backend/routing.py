from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import game.routing
import chat.routing
import core.routing

application = ProtocolTypeRouter(
    {
        "websocket": AuthMiddlewareStack(
            URLRouter(
                core.routing.websocket_urlpatterns +
                game.routing.websocket_urlpatterns +
                chat.routing.websocket_urlpatterns 
            )
        ),
    }
)

