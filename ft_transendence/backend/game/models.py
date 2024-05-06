from django.db import models

# Create your models here.

class GameInvite(models.Model):
    sender = models.ForeignKey('core.Person', on_delete=models.CASCADE, related_name='sender')
    receiver = models.ForeignKey('core.Person', on_delete=models.CASCADE, related_name='receiver')
    accepted = models.BooleanField(default=False)
    rejected = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.sender} invited {self.receiver}'

    def accept(self):
        self.accepted = True
        self.save()

    def reject(self):
        self.rejected = True
        self.save()

class Round(models.Model):
    winner = models.ForeignKey('core.Person', on_delete=models.CASCADE)
    game_room = models.ForeignKey('core.GameRoom', on_delete=models.CASCADE)

    def __str__(self):
        return f'Round winner is {self.winner}'