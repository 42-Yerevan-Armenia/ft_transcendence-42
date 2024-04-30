import json
import uuid
import constants

from core.models import Person

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
        self.game = "barev"
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
                self.thread["active"] = True
            
        # if ()
        # if self.thread["active"]:
        #     self.thread["viewers"].append()
        # print(text_data)

    def propagate_state(self, thread_event):
        i = 0
        while not thread_event.is_set():
            if time.time() - self.time > 0.00003:

                if self.thread:
                    if self.thread["active"]:
                        ball = self.thread["ball"]
                        ball.move()

                        async_to_sync(self.channel_layer.group_send)(
                            self.game,
                            {"type": "stream_state", "state": self.thread["state"],},
                        )
                i += 1
                # print(f"barev{i}")
                self.time = time.time()

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
        self.liveGames = LiveGames()
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
<<<<<<< HEAD
        print("____________" ,method, "     :   ", request)
        if method == "create":
            user_id = request.get("pk")
            print("user_id = request.get(pk) == ", user_id)
            response = CreateRoom.post(self, request, user_id)
=======
        # if method == "connect":

        if method == "create":
            user_id = request.get("pk")
            player = Player(user_id, self.channel_name)
            self.playerPool.add_player(user_id, player)

            response = CreateRoom.post(self, request, user_id)
            responseDecoded = json.loads(response.content)

            if (responseDecoded["success"] == "true"):
                game_room_id = responseDecoded['game_room']
>>>>>>> 9b08010526a4aa14e4aad5db1deed6b4614c1374

            all_user_ids = list(Person.objects.values_list('id', flat=True))
            response["all_user_ids"] = all_user_ids
            response = self.JoinList.get(None, None)
            response["method"] = "create"
            async_to_sync(self.channel_layer.group_send)(
                self.joinList,
                {"type": "stream", "response": response,},
            )
        elif method == "join" or method == "invite":
            # self.gameRoomId = request.get("game_room_id")
            user_id = request.get("user_id")
            json_data = self.JoinList.post(request, user_id)
            print("json_data = ", json_data)
            # async_to_sync(self.channel_layer.group_add)(self.gameRoomId, self.channel_name)


            # print("self.JoinList.pt.get_response_data() = ", self.JoinList.pt.get_response_data())
            game_data = self.JoinList.get_response_data()

            print("game_data = ", game_data)
            # self.roomId = game_data["room_id"]

            # async_to_sync(self.channel_layer.group_add)(self.roomId, self.channel_name)
            # async_to_sync(self.channel_layer.group_discard)(self.joinList, self.channel_name)


            # async_to_sync(self.channel_layer.group_send)(
            #     self.gameRoomId,
            #     {"type": "stream", "response": game_data,},
            # )

            print("stex")
            response = self.JoinList.get(None, None)
            all_user_ids = list(Person.objects.values_list('id', flat=True))
            print("stex")
            response["all_user_ids"] = all_user_ids
            response["method"] = "join"
<<<<<<< HEAD
            creator_id = request.get("creator_id")
            game_room_id = request.get("game_room_id")
            creator = Person.objects.get(id=creator_id)
            game_room = creator.game_room
            if game_room.is_full():
                PlayTournament().post(request, game_room_id=game_room_id, creator_id=creator_id)

            
=======
            response["user_id"] = user_id
            async_to_sync(self.channel_layer.group_send)(
                self.joinList,
                {"type": "stream", "response": response,},
            )

>>>>>>> 9b08010526a4aa14e4aad5db1deed6b4614c1374
        else:
            response = {"error": "Invalid method"}
        # async_to_sync(self.channel_layer.group_send)(
        #     self.joinList,
        #     {"type": "stream", "response": response,},
        # )

    def stream(self, event):
        response = event["response"]
        response_json = response.content.decode("utf-8")
        print("❇️ response_json = ", response_json)
        self.send(response_json)
