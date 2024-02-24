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
    
    def __str__(self):
        return self.nickname

    def save_base64_image(self, image_path=None, image_format='jpg'):
        if image_path:
            base64_string = self.image_to_base64(image_path)
            self.image = base64_string
            self.save()

    def image_to_base64(self, image_path):
        with open(image_path, "rb") as image_file:
            base64_string = base64.b64encode(image_file.read()).decode("utf-8")
        return base64_string
