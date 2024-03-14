import base64
from django.db import models
from django.contrib.auth.models import User

class Person(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100)
    nickname = models.CharField(max_length=30, unique=True)
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    password = models.CharField(max_length=100)
    image = models.TextField(blank=True, null=True)
    background = models.TextField(blank=True, null=True)
    wins = models.IntegerField(default=0)
    loses = models.IntegerField(default=0)
    matches = models.IntegerField(default=0)
    points = models.IntegerField(default=0)
    gamemode = models.CharField(max_length=100, default='classic')
    live = models.BooleanField(default=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='person')

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