import json
import uuid
import constants

from .pong_controller import GameController, PaddleController, BallController
from .thread_pool import ThreadPool

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import time


class PongConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.ball_controller = BallController()
        self.thread = None
        self.time = time.time()
        print("barev")
        super().__init__(*args, **kwargs)

    def connect(self):
        # print("open_code", open_code)
        self.game = self.scope["path"].strip("/").replace(" ", "_")
        self.game = "barev"
        if self.game not in ThreadPool.threads:
            ThreadPool.add_game(self.game, self)

        self.thread = ThreadPool.threads[self.game]

        async_to_sync(self.channel_layer.group_add)(self.game, self.channel_name)
        print("self.channel_name = ", self.channel_name)
        if not self.thread["paddle1"]:
            self.paddle_controller = PaddleController("paddle1")
            self.thread["paddle1"] = True
            self.thread["paddle1_channel_name"] = self.channel_name

        elif not self.thread["paddle2"]:
            self.paddle_controller = PaddleController("paddle2")
            self.thread["paddle2"] = True
            self.thread["paddle2_channel_name"] = self.channel_name

        if self.thread["paddle1"] and self.thread["paddle2"]:
            self.thread["active"] = True

        self.accept()

    def disconnect(self, close_code):
        print("close_code = ", close_code)
        self.thread[str(self.paddle_controller)] = False
        self.thread["active"] = False
        print("self.channel_name = ", self.channel_name)

        async_to_sync(self.channel_layer.group_discard)(self.game, self.channel_name)
        self.thread["stop_event"].set()

    def receive(self, text_data):
        direction = json.loads(text_data).get("direction")
        # if ()
        # if self.thread["active"]:
        #     self.thread["viewers"].append()
        # print(text_data)
        self.paddle_controller.move(direction)

    def propagate_state(self, thread_event):
        i = 0
        while not thread_event.is_set():
            if time.time() - self.time > 0.003:

                if self.thread:
                    if self.thread["active"]:
                        self.ball_controller.move()

                        async_to_sync(self.channel_layer.group_send)(
                            self.game,
                            {"type": "stream_state", "state": GameController.state,},
                        )
                i += 1
                # print(f"barev{i}")
                self.time = time.time()

    def stream_state(self, event):
        state = event["state"]
        payload = {
            "method": "update",
            "state": state
        }
        self.send(text_data=json.dumps(payload))