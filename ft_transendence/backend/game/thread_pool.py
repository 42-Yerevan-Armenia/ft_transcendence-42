import threading
from constants import *
from .pong_controller import PaddleController, BallController
import copy

class ThreadPool:
    """
    threads: {"my_game": {"thread": threading.Thread(), "player_count": 1, }, ...}
    """
    threads = {}

    @classmethod
    async def add_game(cls, game_name, consumer_instance):
        thread_event = threading.Event()
        cls.threads[game_name] = {
            "stop_event": thread_event,
            "thread": threading.Thread(target=consumer_instance.propagate_state_wrapper, args=(thread_event,)),
            "mutex": threading.Lock(),
            "paddle1": False,
            "paddle2": False,
            "ball": None,
            "active": False,
            "viewers": [],
            "state": copy.deepcopy(INITIAL_STATE)
        }
        game = cls.threads[game_name]
        game["ball"] = BallController(game["state"])
        thread = game["thread"]
        thread.daemon = True

    @classmethod
    async def del_game(cls, game_name):
        if game_name not in cls.threads:
            return    
        thread = cls.threads[game_name]
        thread["stop_event"].set()
        if thread["thread"].is_alive():
            thread["thread"].join()
            print()
        if game_name in cls.threads:
            del cls.threads[game_name]
