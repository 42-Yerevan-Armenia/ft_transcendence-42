import json
import uuid
import constants
import asyncio
from time import sleep

from core.models import Person, GameRoom
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist

from .pong_controller import PaddleController, BallController
from .thread_pool import ThreadPool

from asgiref.sync import async_to_sync, sync_to_async
from channels.generic.websocket import WebsocketConsumer, AsyncWebsocketConsumer
import time

from core.views import CreateRoom, JoinList
from game.views import PlayTournament, MatchmakingSystem, PlayerPool, LiveGames, Player

from constants import *

class PongConsumer(AsyncWebsocketConsumer):
    game_info = {}

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
        self.game_id = self.scope["path"].strip("/").replace(" ", "_")
        self.game_id = self.game_id.split("/")[-1]
        if self.game_id not in ThreadPool.threads:
            await ThreadPool.add_game(self.game_id, self)
        self.game = ThreadPool.threads[self.game_id]
        await self.channel_layer.group_add(self.game_id, self.channel_name)
        await self.accept()
        self.joinList.set_channel_layer(self.channel_layer)
        try:
            game_room = LiveGames().get_game(int(self.game_id))
            players_set = set()
            players_set.add(int(game_room["game_room"]["left_id"]))
            players_set.add(int(game_room["game_room"]["right_id"]))
            self.game_info[self.game_id] = players_set
        except ObjectDoesNotExist:
            print(f"❌ Error: GameRoom with id {self.game_id} does not exist")
            return await self.close(code=4006)

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.game_id, self.channel_name)
        if self.id:
            self.game[str(self.paddle_controller)] = False
        if self.game["active"] == False and not self.game["state"]["winner"]:
            await LiveGames().del_game(self.game_id)


            paddle1_id = self.game["state"]["paddle1"]["id"]
            paddle2_id = self.game["state"]["paddle2"]["id"]

            if not self.game["paddle1"]:
                self.game["state"]["winner"] = self.game["state"]["paddle2"]["id"]
            elif not self.game["paddle2"]:
                self.game["state"]["winner"] = self.game["state"]["paddle1"]["id"]

            finish_response = {
                "success": True,
                "method": "finish_match",
                "game_room": {
                    "room_id": self.game_id,
                    "left_id": paddle1_id,
                    "right_id": paddle2_id,
                    "winner": self.game["state"]["winner"]
                } 
            }
            await self.channel_layer.group_send(
                self.game_id,
                {"type": "stream_state", "state": finish_response, "method": "finish_match"},
            )

            if not self.game["paddle1"]:
                await self.set_winner( self.game["state"]["paddle2"]["id"], self.game["state"]["paddle1"]["id"])
            elif not self.game["paddle2"]:
                await self.set_winner(self.game["state"]["paddle1"]["id"], self.game["state"]["paddle2"]["id"])
        
        self.game["active"] = False
        await ThreadPool.del_game(self.game_id)

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
            try:
                self.id = int(data["clientId"])
            except KeyError:
                return await self.close(code=4004)
            if self.id not in self.game_info[self.game_id]:
                return await self.close(code=4005)
            if not self.game["paddle1"]:
                self.paddle_controller = PaddleController("paddle1", self.game["state"])
                self.game["paddle1"] = True
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
            elif not self.game["paddle2"]:
                self.paddle_controller = PaddleController("paddle2", self.game["state"])
                self.game["paddle2"] = True
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
            # if self.game["paddle1"] and self.game["paddle2"]:
            #     if not self.game["thread"].is_alive():
            #         self.game["thread"].start()
            #         self.game["active"] = True
        elif data["method"] == "view":
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
        elif data["method"] == "ready":
            self.game["ready"].add(self.id)
            if self.game["paddle1"] and self.game["paddle2"] and len(self.game["ready"]) == 2:
                if not self.game["thread"].is_alive():
                    self.game["thread"].start()
                    self.game["active"] = True



    def propagate_state_wrapper(self, thread_event):
        asyncio.run(self.propagate_state(thread_event))

    async def propagate_state(self, thread_event):
        while  not self.game["stop_event"].is_set() and self.game["state"]["winner"] is None:
            if self.game:
                if self.game["active"]:
                    ball = self.game["ball"]
                    await ball.move()
                    await self.channel_layer.group_send(
                        self.game_id,
                        {"type": "stream_state", "state": self.game["state"], "method": "update"},
                    )
            sleep(0.005)
        
        await LiveGames().del_game(self.game_id)


        paddle1_id = self.game["state"]["paddle1"]["id"]
        paddle2_id = self.game["state"]["paddle2"]["id"]

        if not self.game["paddle1"]:
            self.game["state"]["winner"] = self.game["state"]["paddle2"]["id"]
        elif not self.game["paddle2"]:
            self.game["state"]["winner"] = self.game["state"]["paddle1"]["id"]

        finish_response = {
            "success": True,
            "method": "finish_match",
            "game_room": {
                "room_id": self.game_id,
                "left_id": paddle1_id,
                "right_id": paddle2_id,
                "winner": self.game["state"]["winner"]
            } 
        }
        await self.channel_layer.group_send(
            self.game_id,
            {"type": "stream_state", "state": finish_response, "method": "finish_match"},
        )

        if not self.game["paddle1"]:
            await self.set_winner(self.game["state"]["winner"], self.game["state"]["paddle1"]["id"])
        elif not self.game["paddle2"]:
            await self.set_winner(self.game["state"]["winner"], self.game["state"]["paddle2"]["id"])

    async def set_winner(self, winner, loser):
        await LiveGames().set_winner(winner, loser)
        await self.joinList.do_broadcast()

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

class joinListConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.joinList = JoinList()
        self.joinList_group_name = "joinlist"

    async def connect(self):
        await self.channel_layer.group_add(self.joinList_group_name, self.channel_name)
        await self.accept()
        response = await sync_to_async(self.joinList.get)(None, None)
        LiveGames().set_group_name(self.joinList_group_name)
        await self.channel_layer.group_send(
            self.joinList_group_name,
            {"type": "stream", "response": response,},
        )

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.joinList_group_name, self.channel_name)

    async def receive(self, text_data):
        request = json.loads(text_data)
        method = request.get("method")
        print(f"Method: {method}")
        if method == "create":
            user_id = request.get("pk")
            response = await sync_to_async(CreateRoom.post)(self, request, user_id)
            response = await sync_to_async(self.joinList.get)(None, None)
            response["method"] = "create"
            await self.channel_layer.group_send(
                self.joinList_group_name,
                {"type": "stream", "response": response,},
            )
        elif method == "join" or method == "invite":
            user_id = request.get("user_id")
            json_data = await sync_to_async(self.joinList.post)(request, user_id)
            response =  await sync_to_async(self.joinList.get)(None, None)
            response["method"] = "join"
            await self.channel_layer.group_send(
                self.joinList_group_name,
                {"type": "stream", "response": response,},
            )
        elif method == "liveGamesRequest":
            await LiveGames().do_broadcast()
            return
        elif method == "get":
            response = await sync_to_async(self.joinList.get)(None, None)
            response["method"] = "get"
            await self.channel_layer.group_send(
                self.joinList_group_name,
                {"type": "stream", "response": response,},
            )
        else:
            response = {"error": "Invalid method"}
        await LiveGames().do_broadcast()

    async def stream(self, event):
        response = event["response"]
        response_json = response.content.decode("utf-8")
        await self.send(response_json)

    async def stream_sate_live(self, event):
        liveGames = event["liveGames"]
        playload = {
            "method": "updateLiveGames",
            "liveGames": liveGames
        }
        await self.send(text_data=json.dumps(playload))
