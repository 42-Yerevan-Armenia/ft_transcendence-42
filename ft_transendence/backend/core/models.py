import base64
from django.db import models
from django.contrib.auth.models import User

class Confirm(models.Model):
    email = models.EmailField()
    code = models.CharField(max_length=100)
    timestamp = models.DateTimeField(auto_now_add=True)

class Person(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    nickname = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    password = models.CharField(max_length=100)
    twofactor = models.BooleanField(default=False) 
    image = models.TextField(blank=True, null=True)
    background = models.TextField(blank=True, null=True)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    matches = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    gamemode = models.CharField(max_length=100, default='classic')
    live = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='person')
    game_room = models.ForeignKey('GameRoom', on_delete=models.SET_NULL, null=True, blank=True, related_name='participants')
    ongoing = models.BooleanField(default=False)
    is_online = models.BooleanField(default=False)

    def __str__(self):
        return self.nickname

    def save_base64_image(self, image_path=None, image_format='jpg'):
        if image_path:
            base64_string = self.image_to_base64(image_path)
            self.image = base64_string
            self.save()

    def save_base64_background(self, background_path=None, background_format='jpg'):
        if background_path:
            base64_string = self.background_to_base64(background_path)
            self.background = base64_string
            self.save()

    def image_to_base64(self, image_path):
        with open(image_path, "rb") as image_file:
            base64_string = base64.b64encode(image_file.read()).decode("utf-8")
        return base64_string

    def background_to_base64(self, background_path):
        with open(background_path, "rb") as background_file:
            base64_string = base64.b64encode(background_file.read()).decode("utf-8")
        return base64_string

class GameRoom(models.Model):
    id = models.AutoField(primary_key=True)
    THEME_CHOICES = (
        ('light', 'Light'),
        ('dark', 'Dark'),
        ('other', 'Other'),
    )
    GAMEMODE_CHOICES = (
        ('easy', 'Easy'),
        ('classic', 'Classic'),
        ('hard', 'Hard'),
    )
    max_players = models.IntegerField(default=2)  # Number of players in the room
    live = models.BooleanField(default=False)  # Indicates if the game room is live or not
    theme = models.CharField(max_length=50, choices=THEME_CHOICES, default='light')  # Theme of the game room
    gamemode = models.CharField(max_length=50, choices=GAMEMODE_CHOICES, default='easy')  # Game mode
    creator = models.ForeignKey(Person, on_delete=models.CASCADE)  # Relationship with the Person who created the game room
    players = models.ManyToManyField(Person, related_name='joined_players', blank=True)  # Relationship with the players in the game room
    ongoing = models.BooleanField(default=False)  # Indicates if the game is ongoing or not
    game_date = models.DateTimeField(null=True, blank=True) # Date of the game

    def __str__(self):
        return f"GameRoom {self.id}"
    
    def is_full(self):
        return self.players.count() == self.max_players

class History(models.Model):
    player = models.ForeignKey(Person, on_delete=models.CASCADE)
    opponent = models.ForeignKey(Person, on_delete=models.CASCADE, related_name='opponent_history')
    game_room = models.ForeignKey(GameRoom, on_delete=models.CASCADE)
    date = models.DateTimeField(auto_now_add=True)
    win = models.BooleanField()
    lose = models.BooleanField()
    image = models.TextField(blank=True, null=True)
    oponent_points = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.player.nickname} vs {self.opponent.nickname} - {self.date}"
