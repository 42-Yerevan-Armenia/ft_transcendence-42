SCREEN_WIDTH = 700
SCREEN_HEIGHT = 500

SCREEN_CENTER = (SCREEN_WIDTH / 2, SCREEN_HEIGHT / 2)

BUTTON_COLOR = (0, 0, 0)

PADDLE_STEP = 8

VEL = 10
MAX_VEL = 2
FPS = 60


PADDLE_WIDTH = 20
PADDLE_HEIGHT = 100

WINNING_SCORE = 10

MAX_PADDLE_X = SCREEN_WIDTH - PADDLE_WIDTH
MAX_PADDLE_Y = SCREEN_HEIGHT - PADDLE_HEIGHT

BALL_WIDTH = 10
BALL_HEIGHT = 10

BALL_RADIUS = 7

MAX_BALL_X = SCREEN_WIDTH - PADDLE_WIDTH - BALL_WIDTH
MAX_BALL_Y = SCREEN_HEIGHT - BALL_HEIGHT

INITIAL_STATE = {
    "paddle1": {
        "x": 0,
        "y": SCREEN_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        "width": PADDLE_WIDTH,
        "height": PADDLE_HEIGHT,
        "score": 0,
    },
    "paddle2": {
        "x": SCREEN_WIDTH - PADDLE_WIDTH,
        "y": SCREEN_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        "width": PADDLE_WIDTH,
        "height": PADDLE_HEIGHT,
        "score": 0,
    },
    "ball": {
        "x": SCREEN_CENTER[0],
        "y": SCREEN_CENTER[1],
        "width": BALL_WIDTH,
        "height": BALL_HEIGHT,
        "radius": BALL_RADIUS
    },
    "winner": None,
}
