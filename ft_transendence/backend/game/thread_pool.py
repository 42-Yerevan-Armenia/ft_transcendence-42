import threading


class ThreadPool:
    """
    threads: {"my_game": {"thread": threading.Thread(), "player_count": 1, }, ...}
    """

    threads = {}

    @classmethod
    def add_game(cls, game_name, consumer_instance):
        thread_event = threading.Event()
        cls.threads[game_name] = {
            "stop_event": thread_event,
            "thread": threading.Thread(target=consumer_instance.propagate_state, args=(thread_event,)),
            "paddle1": False,
            "paddle2": False,
            "active": False,
            "viewers": [],
        }
        thread = cls.threads[game_name]["thread"]
        thread.daemon = True
        thread.start()
        # print(thread.join())

