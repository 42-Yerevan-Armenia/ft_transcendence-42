# файл, в котором будут выполняться все асинхронные функции

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from friendship.models import Friend
from .models import Chat

class ChatConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.roomGroupName = "group_chat_gfg"
		await self.channel_layer.group_add(
			self.roomGroupName ,
			self.channel_name
		)
		await self.accept()
	async def disconnect(self , close_code):
		await self.channel_layer.group_discard(
			self.roomGroupName , 
			self.channel_name 
		)
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json["message"]
		username = text_data_json["username"]
		await self.channel_layer.group_send(
			self.roomGroupName,{
				"type" : "sendMessage" ,
				"message" : message , 
				"username" : username ,
			})
	async def sendMessage(self , event) : 
		message = event["message"]
		username = event["username"]
		await self.send(text_data = json.dumps({"message":message ,"username":username,}))

class ChatRoomConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.chatId = None  # Идентификатор чата
        self.messages = {}  # Словарь для хранения сообщений

    async def connect(self):
        # Получение chatId из URL запроса
        self.chatId = self.scope['url_route']['kwargs']['chatId']
        self.room_group_name = f'chat_{self.chatId}'  # Формирование имени группы чата

        # Присоединение к группе комнат
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()  # Принятие соединения

    async def disconnect(self, close_code):
        # Отсоединение от группы комнат
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # Получение сообщения от WebSocket
    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']
        sender = self.scope['user'].username  # Получение имени отправителя

        # Сохранение сообщения в памяти
        if self.chatId in self.messages:
            self.messages[self.chatId].append({"sender": sender, "message": message})
        else:
            self.messages[self.chatId] = [{"sender": sender, "message": message}]

        # Отправка сообщения в группу комнат
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'sender': sender
            }
        )

    # Получение сообщения от группы комнат
    async def chat_message(self, event):
        message = event['message']
        sender = event['sender']

        # Отправка сообщения обратно на WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'sender': sender
        }))
