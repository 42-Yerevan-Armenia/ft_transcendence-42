import asyncio
import websockets
import json
import jsonpickle
import uuid
import pygame
import threading
from dataclasses import dataclass, asdict
# from typing import List
# from threading import Thread

from channels.generic.websocket import AsyncWebsocketConsumer

pygame.init()
WHITE = (255, 255, 255)
BLACK = (0, 0, 0)


COLOR = WHITE
VEL = 10
MAX_VEL = 5
COLOR = WHITE
MAX_PLAYER = 2

WIDTH, HEIGHT = 700, 500
# WIN = pygame.display.set_mode((WIDTH, HEIGHT))
# pygame.display.set_caption("Pong")

FPS = 60
PADDLE_WIDTH, PADDLE_HEIGHT = 20, 100
BALL_RADIUS = 7

# SCORE_FONT = pygame.font.SysFont("comicsans", 50)
WINNING_SCORE = 10

async def send_game_obj(obj, viewers):
    # print("send_game_obj(obj, viewers):", viewers)
    payLoad = {
        "method": "update",
        "state": {
            obj.id: obj
        }
    }
    payLoadStringify = json.dumps(payLoad, default=vars)
    for x in viewers:
        await x["ws"].send(payLoadStringify)

async def send(obj, viewers):
    payLoadStringify = json.dumps(obj, default=vars)
    for x in viewers:
        await x["ws"].send(payLoadStringify)

@dataclass
class Paddle:

    id: int
    x: int
    y: int
    width: int
    height: int

    def __init__(self, x, y, width, height, id):
        self.id = id
        self.x = self.original_x = x
        self.y = self.original_y = y
        self.width = width
        self.height = height

    # def draw(self, win):
    #     pygame.draw.rect(
    #         win, self.COLOR, (self.x, self.y, self.width, self.height))

    def move(self, up=True):
        if up:
            self.y -= VEL
        else:
            self.y += VEL

    def reset(self):
        self.x = self.original_x
        self.y = self.original_y

@dataclass
class Ball:

    def __init__(self, x, y, radius):
        self.x = self.original_x = x
        self.y = self.original_y = y
        self.radius = radius
        self.x_vel = MAX_VEL
        self.y_vel = 0
        self.id = "ball"
        self.ballRadius = BALL_RADIUS

    def draw(self, win):
        pygame.draw.circle(win, self.COLOR, (self.x, self.y), self.radius)

    def move(self):
        self.x += self.x_vel
        self.y += self.y_vel

    def reset(self):
        self.x = self.original_x
        self.y = self.original_y
        self.y_vel = 0
        self.x_vel *= -1

@dataclass
class Player:
    id: int
    score: int
    paddle: Paddle
    ball: Ball

    def __init__(self, id, paddle, websocket):
        self.id = id
        self.score = 0
        self.paddle = paddle

@dataclass
class Game(AsyncWebsocketConsumer):
    
    id: int
    playeres: list
    viewers: list

    def __init__(self, id):
        self.id = id
        self.viewers = []
        self.playeres = []
        self.ball = Ball(WIDTH // 2, HEIGHT // 2, BALL_RADIUS)
    
    # def toJson(self):
    #     return (json.dumps(self, default=vars))

    def addPlayer(self, id, websocket, name):
        if len(self.playeres) < MAX_PLAYER:
            if len(self.playeres) == 0:
                player = Player(id, Paddle(10, HEIGHT//2 - PADDLE_HEIGHT //
                                2, PADDLE_WIDTH, PADDLE_HEIGHT, name), websocket)
            else:
                player = Player(id, Paddle(WIDTH - 10 - PADDLE_WIDTH, HEIGHT //
                                2 - PADDLE_HEIGHT//2, PADDLE_WIDTH, PADDLE_HEIGHT, name), websocket)
            self.playeres.append(player)
            self.viewers.append({
                "id": id,
                "ws": websocket,
            })

    def handle_collision(self, ball, left_paddle, right_paddle):
        if ball.y + ball.radius >= HEIGHT:
            ball.y_vel *= -1
        elif ball.y - ball.radius <= 0:
            ball.y_vel *= -1

        if ball.x_vel < 0:
            if ball.y >= left_paddle.y and ball.y <= left_paddle.y + left_paddle.height:
                if ball.x - ball.radius <= left_paddle.x + left_paddle.width:
                    ball.x_vel *= -1

                    middle_y = left_paddle.y + left_paddle.height / 2
                    difference_in_y = middle_y - ball.y
                    reduction_factor = (left_paddle.height / 2) / MAX_VEL
                    y_vel = difference_in_y / reduction_factor
                    ball.y_vel = -1 * y_vel

        else:
            if ball.y >= right_paddle.y and ball.y <= right_paddle.y + right_paddle.height:
                if ball.x + ball.radius >= right_paddle.x:
                    ball.x_vel *= -1

                    middle_y = right_paddle.y + right_paddle.height / 2
                    difference_in_y = middle_y - ball.y
                    reduction_factor = (right_paddle.height / 2) / MAX_VEL
                    y_vel = difference_in_y / reduction_factor
                    ball.y_vel = -1 * y_vel

    #  TODO there is a bug
    async def handle_paddle_movement(self, paddle, up=True):
        if up == True and paddle.y - VEL >= 0:
            paddle.move(up)
            await send_game_obj(paddle, self.viewers)
        if  up == False and paddle.y + VEL + paddle.height <= HEIGHT:
            paddle.move(up)
            await send_game_obj(paddle, self.viewers)

    async def some_callback(args):
        await some_function()

    def between_callback(self, args):
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)

        loop.run_until_complete(self.start())
        loop.close()

    async def start(self):
        run = True
        clock = pygame.time.Clock()

        left_paddle = self.playeres[0].paddle
        right_paddle = self.playeres[1].paddle
        ball = self.ball
        # print("self.viewers = ", self.viewers)
        await send_game_obj(left_paddle, self.viewers)
        await send_game_obj(right_paddle, self.viewers)
        await send_game_obj(ball, self.viewers)
        left_score = 0
        right_score = 0

        while run:
            clock.tick(FPS)
            # draw(WIN, [left_paddle, right_paddle], ball, left_score, right_score)

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    run = False
                    break

            # keys = pygame.key.get_pressed()
            if len(queueMovements) != 0:
                result =  queueMovements.pop(0)
                if result["clientId"] == self.playeres[0].id:
                    await self.handle_paddle_movement(self.playeres[0].paddle, True if result["keyCode"] == "up" else False)
                elif result["clientId"] == self.playeres[1].id:
                    await self.handle_paddle_movement(self.playeres[1].paddle, True if result["keyCode"] == "up" else False)
            ball.move()
            await send_game_obj(ball, self.viewers)
            self.handle_collision(ball, left_paddle, right_paddle)

            if ball.x < 0:
                right_score += 1
                ball.reset()
                payLoad = {
                    "method": "update",
                    "mode": "updateScore",
                    "state": {
                        "score1": left_score,
                        "score2": right_score,
                    }
                }
                await send(payLoad, self.viewers)
            elif ball.x > WIDTH:
                left_score += 1
                ball.reset()
                payLoad = {
                    "method": "update",
                    "mode": "updateScore",
                    "state": {
                        "score1": left_score,
                        "score2": right_score,
                    }
                }
                await send(payLoad, self.viewers)
            won = False
            if left_score >= WINNING_SCORE:
                won = True
                win_text = "Left Player Won!"
            elif right_score >= WINNING_SCORE:
                won = True
                win_text = "Right Player Won!"

            if won:
                # text = SCORE_FONT.render(win_text, 1, WHITE)
                # WIN.blit(text, (WIDTH//2 - text.get_width() //
                #                 2, HEIGHT//2 - text.get_height()//2))
                # pygame.display.update()
                pygame.time.delay(5000)
                ball.reset()
                left_paddle.reset()
                right_paddle.reset()
                await send_game_obj(left_paddle, self.viewers)
                await send_game_obj(right_paddle, self.viewers)
                await send_game_obj(ball, self.viewers)
                left_score = 0
                right_score = 0
                payLoad = {
                    "method": "update",
                    "mode": "updateScore",
                    "state": {
                        "score1": left_score,
                        "score2": right_score,
                    }
                }
                await send(payLoad, self.viewers)

games = {}

queueMovements = []

async def server(websocket, path):
    try:
        async for message in websocket:
            result = json.loads(message)
            # print("Server Received: ", message)
            payLoad = {}
            if result["method"] == "create":
                gameId = uuid.uuid4()
                gameId = str(gameId)
                game = Game(gameId)
                games[gameId] = game
                game.addPlayer(result["clientId"], websocket, "paddle1")
                payLoad = {
                    "method": "create",
                    "game": {
                        "id": game.id,
                        "playeres": game.playeres,
                        "viewers": [],
                }
                }
            if result["method"] == "join":
                payLoad = {
                    "method": "join",
                }
                gameId = result["gameId"]
                if gameId == None:
                    payLoad["error"] = "game is not found"
                else:
                    try:
                        game = games[gameId]
                        if len(game.playeres) >= 2:
                            payLoad["game"] = {
                                "id": game.id,
                                "playeres": game.playeres,
                                "viewers": [],
                            }
                            payLoad["error"] = "game is full"
                        else:
                            game.addPlayer(result["clientId"], websocket, "paddle2")
                            payLoad["game"] = {
                                "id": game.id,
                                "playeres": game.playeres,
                                "viewers": [],
                                "state": {
                                    game.playeres[0].paddle.id: game.playeres[0].paddle,
                                    game.playeres[1].paddle.id: game.playeres[1].paddle,
                                    "ball": game.ball,
                                }
                            }
                        payLoadStringify = json.dumps(payLoad, default=vars)
                        for x in game.viewers:
                            await x["ws"].send(payLoadStringify)
                    except KeyError:
                        payLoad["error"] = "game is not found"
                        payLoadStringify = json.dumps(payLoad, default=vars)
                        for x in game.viewers:
                            await websocket.send(payLoadStringify)

                    continue
            if result["method"] == "start":
                payLoad = {
                    "method": "update",
                }
                gameId = result["gameId"]
                if gameId == None:
                    payLoad["error"] = "game is not found"
                else:
                    try:
                        game = games[gameId]
                        if len(game.playeres) < 2:
                            payLoad["game"] = {
                                "id": game.id,
                                "playeres": game.playeres,
                                "viewers": [],
                            }
                            payLoad["error"] = "game is empty"
                        else:
                            t = threading.Thread(target=game.between_callback, args=(1,))
                            t.start()
                            payLoad["game"] = {
                                "id": game.id,
                                "playeres": game.playeres,
                                "viewers": [],
                            }
                    except KeyError:
                        payLoad["error"] = "game is not found"
            if result["method"] == "updateKey":
                payLoad = {
                    "method": "updateKey",
                }
                gameId = result["gameId"]
                if gameId == None:
                    payLoad["error"] = "game is not found"
                else:
                    try:
                        game = games[gameId]
                        if len(game.playeres) < 2:
                            payLoad["game"] = {
                                "id": game.id,
                                "playeres": game.playeres,
                                "viewers": [],
                            }
                            payLoad["error"] = "game is empty"
                        else:
                            queueMovements.append(result)
                            continue
                            # else:
                            #     payLoad["error"] = "player is not found"
                    except KeyError:
                        payLoad["error"] = "game is not found"

            payLoadStringify = json.dumps(payLoad, default=vars)
            # payLoadStringify = json_string = jsonpickle.encode(payLoad)
            await websocket.send(payLoadStringify)
            # print(f'Server Sent: {payLoadStringify}')
    finally:
        print("Unregister")

start_server = websockets.serve(server, "ws/game", 8000)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
