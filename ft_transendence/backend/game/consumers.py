import json
import uuid
import constants
import asyncio
from time import sleep

from core.models import Person
from django.http import JsonResponse

from .pong_controller import PaddleController, BallController
from .thread_pool import ThreadPool

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import time

from core.views import CreateRoom, JoinList
from game.views import PlayTournament, MatchmakingSystem, PlayerPool, LiveGames, Player

from constants import *

class PongConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        self.game = None
        self.game_id = None
        self.time = time.time()
        self.id = None
        super().__init__(*args, **kwargs)
        self.paddle_controller = None
        self.joinList = JoinList()
        self.joinList_group_name = "joinlist"
        self.joinList.set_group_name(self.joinList_group_name)


    async def connect(self):
        print("✅Connection initiated")
        self.game_id = self.scope["path"].strip("/").replace(" ", "_")
        self.game_id = self.game_id.split("/")[-1]
        print(f"✅Connecting to game ID: {self.game_id}")
        if self.game_id not in ThreadPool.threads:
            await ThreadPool.add_game(self.game_id, self)
        self.game = ThreadPool.threads[self.game_id]
        await self.channel_layer.group_add(self.game_id, self.channel_name)
        await self.accept()

        self.joinList.set_channel_layer(self.channel_layer)
        print(f"✅Connected to game ID: {self.game_id}, channel name: {self.channel_name}")


    async def disconnect(self, close_code):
        print(f"⭕️Disconnecting: {self.id}, close_code: {close_code}")
        await self.channel_layer.group_discard(self.game_id, self.channel_name)
        if self.id:
            self.game[str(self.paddle_controller)] = False
            self.game["active"] = False
            self.game["stop_event"].set()
            await ThreadPool.del_game(self.game_id)
        print(f"⭕️Disconnected: {self.id}")

    async def receive(self, text_data):
        data = json.loads(text_data)
        try:
            data["method"]
        except KeyError:
            return

        if data["method"] == "updateKey" and self.game:
            if not self.paddle_controller:
                print("Error: Paddle controller is not initialized")
            else:
                direction = data.get("direction")
                await self.paddle_controller.move(direction)
        elif data["method"] == "connect":
            print(f"✅Connect method called with clientId: {data['clientId']}")
            if not self.game["paddle1"]:
                print("🅿️ Assigning paddle1")
                self.paddle_controller = PaddleController("paddle1", self.game["state"])
                self.game["paddle1"] = True
                self.id = data["clientId"]
                self.game["state"][self.id] = "paddle1"
                self.game["state"]["paddle1"]["id"] = self.id
                self.game["paddle1_channel_name"] = self.channel_name
                payload = {
                    "method": "connect",
                    "state": self.game["state"],
                    "constants": {
                        "paddle_step": constants.PADDLE_STEP,
                        "screen_width": constants.SCREEN_WIDTH,
                        "screen_height": constants.SCREEN_HEIGHT,
                    }
                }
                await self.send(text_data=json.dumps(payload))
                print(f"🅿️ Assigned paddle1 to clientId: {self.id}")
            elif not self.game["paddle2"]:
                print("🅿️ Assigning paddle2")
                self.paddle_controller = PaddleController("paddle2", self.game["state"])
                self.game["paddle2"] = True

                self.id = data["clientId"]
                self.game["state"][self.id] = "paddle2"
                self.game["state"]["paddle2"]["id"] = self.id
                self.game["paddle2_channel_name"] = self.channel_name
                payload = {
                    "method": "connect",
                    "state": self.game["state"],
                    "constants": {
                        "paddle_step": constants.PADDLE_STEP,
                        "screen_width": constants.SCREEN_WIDTH,
                        "screen_height": constants.SCREEN_HEIGHT,
                    }
                }
                await self.send(text_data=json.dumps(payload))
                print(f"🅿️ Assigned paddle2 to clientId: {self.id}")
            else:
                print("🅿️🅿️ Both paddles are already assigned")
            if self.game["paddle1"] and self.game["paddle2"]:
                if not self.game["thread"].is_alive():
                    self.game["thread"].start()
                    self.game["active"] = True
                    print("❎Game started")

    def propagate_state_wrapper(self, thread_event):
        asyncio.run(self.propagate_state(thread_event))

    async def propagate_state(self, thread_event):
        i = 0
        while not thread_event.is_set() and self.game["state"]["winner"] is None:
            if self.game:
                if self.game["active"]:
                    ball = self.game["ball"]
                    await ball.move()
                    await self.channel_layer.group_send(
                        self.game_id,
                        {"type": "stream_state", "state": self.game["state"], "method": "update"},
                    )
                elif not self.game["paddle1"]:
                    self.game["state"]["winner"] = self.game["paddle2"]["id"]
                    await LiveGames().set_winner(self.game["state"]["winner"], self.game["paddle1"]["id"])
                elif not self.game["paddle2"]:
                    self.game["state"]["winner"] = self.game["paddle1"]["id"]
                    await LiveGames().set_winner(self.game["state"]["winner"], self.game["paddle2"]["id"])
            sleep(0.005)
                # self.time = time.time()

        await LiveGames().del_game(self.game_id)
        await self.joinList.do_broadcast()
        # get left and right ids from self.game_id
        paddle1_id = self.game["state"]["paddle1"]["id"]
        paddle2_id = self.game["state"]["paddle2"]["id"]

        # Construct the JSON response with the finish signal
        finish_response = {
            "success": True,
            "method": "finish_match",
            "game_room": {
                "room_id": self.game_id,
                "left_id": paddle1_id,
                "right_id": paddle2_id
            } 
        }
        print("✅ finish_response", finish_response)
        await self.channel_layer.group_send(
            self.game_id,
            {"type": "stream_state", "state": finish_response, "method": "finish_match"},
        )

    async def stream_state(self, event):
        state = event["state"]
        method = event["method"]
        payload = {
            "method": method,
            "state": state
        }
        try:
            await self.send(text_data=json.dumps(payload))
        except Exception as e:
            print(e)

class joinListConsumer(WebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # self.roomId = None
        # self.pt = PlayTournament()
        # self.playerPool = PlayerPool()
        self.joinList = JoinList()
        self.joinList_group_name = "joinlist"

    def connect(self):
        # self.joinList_group_name = self.scope["path"].strip("/").replace(" ", "_")
        async_to_sync(self.channel_layer.group_add)(self.joinList_group_name, self.channel_name)
        self.accept()
        response = self.joinList.get(None, None)
        LiveGames().set_group_name(self.joinList_group_name)
        async_to_sync(self.channel_layer.group_send)(
            self.joinList_group_name,
            {"type": "stream", "response": response,},
        )

    def disconnect(self, close_code):
        async_to_sync(self.channel_layer.group_discard)(self.joinList_group_name, self.channel_name)

    def receive(self, text_data):
        request = json.loads(text_data)
        method = request.get("method")
        print("method = ", method)
        if method == "create":
            user_id = request.get("pk")
            response = CreateRoom.post(self, request, user_id)
            all_user_ids = list(Person.objects.values_list('id', flat=True))
            response["all_user_ids"] = all_user_ids
            response = self.joinList.get(None, None)
            response["method"] = "create"
            async_to_sync(self.channel_layer.group_send)(
                self.joinList_group_name,
                {"type": "stream", "response": response,},
            )
        elif method == "join" or method == "invite":
            user_id = request.get("user_id")
            json_data = self.joinList.post(request, user_id)
            response = self.joinList.get(None, None)
            all_user_ids = list(Person.objects.values_list('id', flat=True))
            response["all_user_ids"] = all_user_ids
            response["method"] = "join"
        else:
            response = {"error": "Invalid method"}
        async_to_sync(self.channel_layer.group_send)(
            self.joinList_group_name,
            {"type": "stream", "response": response,},
        )

    def stream(self, event):
        response = event["response"]
        response_json = response.content.decode("utf-8")
        # print("❇️ response_json = ", response_json)
        try:
            # self.send(text_data=json.dumps(response_json))
            self.send(response_json)
        except Exception as e:
            print("Error", e)


    # def stream_state(self, event):
    #     # Handle the "stream_state" message type here
    #     state = event["state"]
    #     # Process the incoming state message as needed
    #     payload = {
    #         "method": "update_state",
    #         "state": state
    #     }
    #     try:
    #         self.send(text_data=json.dumps(playload))
    #     except Exception as e:
    #         print("Error", e)

    def stream_sate_live(self, event):
        liveGames = event["liveGames"]
        playload = {
            "method": "updateLiveGames",
            "liveGames": liveGames
        }
        try:
            self.send(text_data=json.dumps(playload))
        except Exception as e:
            print("Error", e)