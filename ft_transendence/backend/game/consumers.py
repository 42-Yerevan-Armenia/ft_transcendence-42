import json
import uuid
import constants

from core.models import Person
from django.http import JsonResponse

from .pong_controller import PaddleController, BallController
from .thread_pool import ThreadPool

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import time

from core.views import CreateRoom, JoinList
from game.views import PlayTournament, MatchmakingSystem, PlayerPool, LiveGames, Player

from constants import *

class PongConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.thread = None
        self.time = time.time()
        self.id = None
        super().__init__(*args, **kwargs)

    def connect(self):
        # print("open_code", open_code)
        self.game = self.scope["path"].strip("/").replace(" ", "_")
        self.game = self.game.split("/")[-1]
        if self.game not in ThreadPool.threads:
            ThreadPool.add_game(self.game, self)

        self.thread = ThreadPool.threads[self.game]

        async_to_sync(self.channel_layer.group_add)(self.game, self.channel_name)
        print("self.channel_name = ", self.channel_name)

        self.accept()

    def disconnect(self, close_code):
        print("close_code = ", close_code)
        async_to_sync(self.channel_layer.group_discard)(self.game, self.channel_name)

        if self.id:
            self.thread[str(self.paddle_controller)] = False
            self.thread["active"] = False
            print("self.channel_name = ", self.channel_name)

            self.thread["stop_event"].set()
            ThreadPool.del_game(self.game)
            print("len of threads = ", len(ThreadPool.threads))

    def receive(self, text_data):
        data = json.loads(text_data)

        if data["method"] == "updateKey":
            direction = data.get("direction")
            self.paddle_controller.move(direction)
        elif data["method"] == "connect":
            if not self.thread["paddle1"]:
                self.paddle_controller = PaddleController("paddle1", self.thread["state"])
                self.thread["paddle1"] = True
                # GameController.state["player1"] = {
                #     "id": data["clientId"],
                #     "paddleName": "paddle1"
                # }
                self.id = data["clientId"]
                self.thread["state"][self.id] = "paddle1"
                self.thread["state"]["paddle1"]["id"] = self.id
                self.thread["paddle1_channel_name"] = self.channel_name
                payload = {
                    "method": "connect",
                    "state": self.thread["state"],
                    "constants": {
                        "paddle_step": constants.PADDLE_STEP,
                        "screen_width": constants.SCREEN_WIDTH,
                        "screen_height": constants.SCREEN_HEIGHT,
                    }
                }
                self.send(text_data=json.dumps(payload))

            elif not self.thread["paddle2"]:
                self.paddle_controller = PaddleController("paddle2", self.thread["state"])
                self.thread["paddle2"] = True

                self.id = data["clientId"]
                self.thread["state"][self.id] = "paddle2"
                self.thread["state"]["paddle2"]["id"] = self.id
                self.thread["paddle2_channel_name"] = self.channel_name
                payload = {
                    "method": "connect",
                    "state": self.thread["state"],
                    "constants": {
                        "paddle_step": constants.PADDLE_STEP,
                        "screen_width": constants.SCREEN_WIDTH,
                        "screen_height": constants.SCREEN_HEIGHT,
                    }
                }
                self.send(text_data=json.dumps(payload))

            if self.thread["paddle1"] and self.thread["paddle2"]:
                self.thread["thread"].start()
                self.thread["active"] = True
            
        # if ()
        # if self.thread["active"]:
        #     self.thread["viewers"].append()
        # print(text_data)

    def propagate_state(self, thread_event):
        i = 0
        while not thread_event.is_set() and self.thread["state"]["winner"] is None:
            if time.time() - self.time > 0.00003:

                if self.thread:
                    if self.thread["active"]:
                        ball = self.thread["ball"]
                        ball.move()

                        async_to_sync(self.channel_layer.group_send)(
                            self.game,
                            {"type": "stream_state", "state": self.thread["state"],},
                        )
                    elif not self.thread["paddle1"]:
                        self.thread["state"]["winner"] = self.thread["paddle2"]["id"]
                        LiveGames().get_winner(self.thread["state"]["winner"], self.thread["paddle1"]["id"])
                    elif not self.thread["paddle2"]:
                        self.thread["state"]["winner"] = self.thread["paddle1"]["id"]
                        LiveGames().get_winner(self.thread["state"]["winner"], self.thread["paddle2"]["id"])
                i += 1
                self.time = time.time()
        LiveGames().del_game(self.game)
        print(" thread finished")

    def stream_state(self, event):
        state = event["state"]
        payload = {
            "method": "update",
            "state": state
        }
        try:
            self.send(text_data=json.dumps(payload))
        except Exception as e:
            print(e)

class joinListConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.roomId = None
        self.pt = PlayTournament()
        self.playerPool = PlayerPool()
        self.JoinList = JoinList()

    def connect(self):
        self.joinList = self.scope["path"].strip("/").replace(" ", "_")
        self.joinList = "barev"
        async_to_sync(self.channel_layer.group_add)(self.joinList, self.channel_name)
        self.accept()
        response = self.JoinList.get(None, None)
        async_to_sync(self.channel_layer.group_send)(
            self.joinList,
            {"type": "stream", "response": response,},
        )

    def disconnect(self, close_code):
        print("close_code = ", close_code)
        print("self.channel_name = ", self.channel_name)

        async_to_sync(self.channel_layer.group_discard)(self.joinList, self.channel_name)

    def receive(self, text_data):
        request = json.loads(text_data)
        method = request.get("method")
        print("____________" ,method, "     :   ", request)
        if method == "create":
            user_id = request.get("pk")
            print("user_id = request.get(pk) == ", user_id)
            response = CreateRoom.post(self, request, user_id)
            all_user_ids = list(Person.objects.values_list('id', flat=True))
            response["all_user_ids"] = all_user_ids
            response = self.JoinList.get(None, None)
            response["method"] = "create"
            async_to_sync(self.channel_layer.group_send)(
                self.joinList,
                {"type": "stream", "response": response,},
            )
        elif method == "join" or method == "invite":
            user_id = request.get("user_id")
            json_data = self.JoinList.post(request, user_id)

            response = self.JoinList.get(None, None)
            all_user_ids = list(Person.objects.values_list('id', flat=True))
            response["all_user_ids"] = all_user_ids
            response["method"] = "join"
        else:
            response = {"error": "Invalid method"}
        response_data = json.loads(response.content)
        live = LiveGames().get_all_games()
        response_data["liveGames"] = live
        response = JsonResponse(response_data)
        async_to_sync(self.channel_layer.group_send)(
            self.joinList,
            {"type": "stream", "response": response,},
        )

    def stream(self, event):
        response = event["response"]
        response_json = response.content.decode("utf-8")
        # print("❇️ response_json = ", response_json)
        self.send(response_json)

    def stream_state(self, event):
        # Handle the "stream_state" message type here
        state = event["state"]
        # Process the incoming state message as needed
        payload = {
            "method": "update_state",
            "state": state
        }
        # Send the processed state data back to the client
        self.send(text_data=json.dumps(payload))
