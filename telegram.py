
from distutils.log import error
from telethon import TelegramClient, events, sync
from flask import Flask,  request
from multiprocessing import Process
import requests
import json
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
import re
import connect

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")

emoji_pattern = re.compile("["
        u"\U0001F600-\U0001F64F"  # emoticons
        u"\U0001F300-\U0001F5FF"  # symbols & pictographs
        u"\U0001F680-\U0001F6FF"  # transport & map symbols
        u"\U0001F1E0-\U0001F1FF"  # flags (iOS)
        u"\U00002500-\U00002BEF"  # chinese char
        u"\U00002702-\U000027B0"
        u"\U00002702-\U000027B0"
        u"\U000024C2-\U0001F251"
        u"\U0001f926-\U0001f937"
        u"\U00010000-\U0010ffff"
        u"\u2640-\u2642" 
        u"\u2600-\u2B55"
        u"\u200d"
        u"\u23cf"
        u"\u23e9"
        u"\u231a"
        u"\ufe0f"  # dingbats
        u"\u3030"
                      "]+", re.UNICODE)
telegramArr = []

# Messages API Route


@socketio.on('message', namespace="/")
@cross_origin()
def handle_message():
    print("message")


@app.route("/")
@cross_origin()
def members():
    return{"messages": telegramArr}


@app.route("/", methods=['POST'])
@cross_origin()
def add_message():
    connect.getOptionPrice("300","6/17", "AAPL", "c")
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
        newMessage = emoji_pattern.sub(r'', newMessage)

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
