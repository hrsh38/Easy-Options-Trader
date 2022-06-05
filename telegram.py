
from distutils.log import error
from telethon import TelegramClient, events, sync
from flask import Flask,  request
from multiprocessing import Process
import requests
import json
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
import re


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")


telegramArr = []

# Messages API Route


# @socketio.on('message', namespace="/")
# @cross_origin()
# def handle_message():
#     send("message")


@app.route("/")
@cross_origin()
def members():
    return{"messages": telegramArr}


@app.route("/", methods=['POST'])
@cross_origin()
def add_message():
    socketio.emit("message", request.get_data().decode("utf-8"))
    telegramArr.append(request.get_data().decode("utf-8"))
    return "New message", 204


def b():
    api_id = "12510265"

    api_hash = "9a2309a0a34b0c8d9eee2ce409e4a30a"

    user_input_channel = "https://t.me/testingtestertest"

    client = TelegramClient('Test', api_id, api_hash).start()

    @client.on(events.NewMessage())
    async def newMessage(event):
        newMessage = event.message.message
        newMessage = re.sub(u"(\u2018|\u2019)", "'", newMessage)

        print(newMessage)
        try:
            requests.post("http://127.0.0.1:5000/", newMessage)
        except:
            print("here")
            print(error)
        # print(newMessage)

    with client:
        client.run_until_disconnected()


if __name__ == "__main__":
    # Process(target=b).start()
    p = Process(target=b)
    p.start()
    # app.run(debug=True, use_reloader=False)
    socketio.run(app)
    p.join()
