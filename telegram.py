import configparser
import json
import re
import asyncio
from telethon.errors import SessionPasswordNeededError
from telethon import TelegramClient, events, sync
from telethon.tl.functions.messages import (GetHistoryRequest)
from telethon.tl.types import (
PeerChannel
)

api_id = "12510265"
api_hash = "9a2309a0a34b0c8d9eee2ce409e4a30a"

user_input_channel = "https://t.me/testingtestertest"

client = TelegramClient('Test', api_id, api_hash).start()

@client.on(events.NewMessage())
async def newMessage(event):
    newMessage = event.message.message
    print(newMessage)

with client:
    client.run_until_disconnected()

