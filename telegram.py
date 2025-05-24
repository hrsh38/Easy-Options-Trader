"""
WebSocket server for real-time options trading interface.
Handles communication between frontend and TD Ameritrade API.
"""

from distutils.log import error
from io import BytesIO
# from telethon import TelegramClient, events, sync
from flask import Flask,  request
# from multiprocessing import Process
# import requests
# import json
from flask_cors import CORS, cross_origin
from flask_socketio import SocketIO
# import re
import connect

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app, cors_allowed_origins="*")


# Messages API Route


@socketio.on('message')
@cross_origin()
def handle_message():
    """Handles general WebSocket messages."""
    print("message")


@socketio.on('join', namespace="/")
@cross_origin()
def handle_join():
    """Handles client connection to WebSocket."""
    return ""


@socketio.on('options', namespace="/")
@cross_origin()
def getOptionsPrice(symbol, date, type, strike):
    """
    Retrieves and broadcasts option price updates.
    Emits live option prices to connected clients.
    """
    print(symbol, date, type, strike)
    ret = connect.getOptionPrice(symbol, date, type, strike)
    socketio.emit("liveOptions", ret)
    return ""


@socketio.on('getOptionsPriceUpdate', namespace="/")
@cross_origin()
def getOptionsPrice(symbol, date, type, strike):
    """
    Retrieves and broadcasts real-time option price updates.
    Emits live option price updates to connected clients.
    """
    print(symbol, date, type, strike)
    ret = connect.getOptionPrice(symbol, date, type, strike)
    socketio.emit("liveOptionsUpdate", ret)
    return ""


@socketio.on('getOptionsData', namespace="/")
@cross_origin()
def getOptionsData(symbol, date, type, strike):
    """
    Retrieves and broadcasts detailed option contract data.
    Emits comprehensive option data to connected clients.
    """
    print(symbol, date, type, strike)
    ret = connect.getOptionData(symbol, date, type, strike)
    # print(ret)
    socketio.emit("liveOptionsData", ret)
    return ""


@socketio.on('place_options_order', namespace="/")
@cross_origin()
def placeOrder(symbol, date_month, date_day, type, strike, quantity, ask_price):
    """
    Places a limit order for options and broadcasts status.
    Emits order status to connected clients.
    """
    # print(symbol,date, type, strike)
    ret = connect.placeOptionsOrder(
        symbol, date_month, date_day, type, strike, quantity, ask_price)
    print(str(ret))
    socketio.emit("orderStatus", str(ret))
    return ""


@socketio.on('place_options_order_market', namespace="/")
@cross_origin()
def placeOptionsOrderMarket(symbol, date_month, date_day, type, strike, quantity):
    """
    Places a market order for options and broadcasts status.
    Emits order status to connected clients.
    """
    print(symbol, type, strike)
    ret = connect.placeOptionsOrderMarket(
        symbol, date_month, date_day, type, strike, quantity)
    print(str(ret))
    socketio.emit("orderStatus", str(ret))
    return ""


@socketio.on('sellPosition', namespace="/")
@cross_origin()
def sellToClosePosition(symbol, quantity, ask_price):
    """
    Places a limit order to sell position and broadcasts status.
    Emits sell order status to connected clients.
    """
    print(symbol, quantity, ask_price)
    ret = connect.sellToClosePosition(symbol, quantity, ask_price)
    socketio.emit("sellPositionStatus", str(ret))
    return ""


@socketio.on('sellMarketPosition', namespace="/")
@cross_origin()
def sellMarketPosition(symbol, quantity):
    """
    Places a market order to sell position and broadcasts status.
    Emits sell order status to connected clients.
    """
    print(symbol, quantity)
    ret = connect.sellMarketPosition(symbol, quantity)
    socketio.emit("sellPositionStatusMarket", str(ret))
    return ""


@socketio.on('placeStopLimitOrder', namespace="/")
@cross_origin()
def placeStopLimitOrder(symbol, quantity, stop_price, limit_price):
    """
    Places a stop-limit order and broadcasts status.
    Emits stop order status to connected clients.
    """
    print(symbol, quantity)
    ret = connect.placeStopLimitOrder(
        symbol, quantity, stop_price, limit_price)
    socketio.emit("stopOrderStatus", str(ret))
    return ""


@socketio.on('placeStopMarketOrder', namespace="/")
@cross_origin()
def placeStopMarketOrder(symbol, quantity, stop_price):
    """
    Places a stop-market order and broadcasts status.
    Emits stop order status to connected clients.
    """
    print(symbol, quantity)
    ret = connect.placeStopMarketOrder(
        symbol, quantity, stop_price)
    socketio.emit("stopOrderStatus", str(ret))
    return ""


@socketio.on('getPositions', namespace="/")
@cross_origin()
def getPositions():
    """
    Retrieves and broadcasts current positions.
    Emits position data to connected clients.
    """
    print("pos")
    ret = connect.getPositions()
    socketio.emit("positions", ret)
    return ""


@socketio.on('getOrdersForStop', namespace="/")
@cross_origin()
def getOrdersForStop(symbol):
    """
    Retrieves and broadcasts stop orders for a symbol.
    Emits stop order data to connected clients.
    """
    print("orders")
    ret = connect.getOrdersForStop(symbol)
    socketio.emit("stopOrders", ret)
    return ""


@socketio.on('cancelOrdersFromId', namespace="/")
@cross_origin()
def cancelOrdersFromId(symbol):
    """
    Cancels orders for a symbol and broadcasts status.
    Emits cancellation status to connected clients.
    """
    print("orders")
    ret = connect.cancelOrdersFromId(symbol)
    socketio.emit("status", ret)
    return ""


@socketio.on('getOrders', namespace="/")
@cross_origin()
def getOrders():
    """
    Retrieves and broadcasts all orders.
    Emits order data to connected clients.
    """
    print("orders")
    ret = connect.getOrders()
    socketio.emit("allOrders", ret)
    return ""


@socketio.on('getLastOrderStatus', namespace="/")
@cross_origin()
def getOrdersOnce():
    """
    Retrieves and broadcasts last order status.
    Emits last order status to connected clients.
    """
    ret = connect.getLastOrderStatus()
    print("Last Order Status: ", ret)
    socketio.emit("lastOrderStatus", ret)
    return ""


@socketio.on('cancelOrders', namespace="/")
@cross_origin()
def cancelOrders(id):
    """
    Cancels a specific order and broadcasts status.
    Emits cancellation status to connected clients.
    """
    print(id)
    ret = connect.cancelOrders(str(id))
    print(ret)
    socketio.emit("cancelOrderStatus", str(ret))
    return ""


@socketio.on('cancelAllOrders', namespace="/")
@cross_origin()
def cancelAllOrders():
    """
    Cancels all orders and broadcasts status.
    Emits cancellation status to connected clients.
    """
    ret = connect.cancelAllOrders()
    socketio.emit("cancelAllOrdersStatus", ret)
    return ""


@socketio.on('getAccountInfo', namespace="/")
@cross_origin()
def getAccountInfo():
    """
    Retrieves and broadcasts account information.
    Emits account data to connected clients.
    """
    ret = connect.getAccountInfo()
    socketio.emit("accountInfo", ret)
    return ""


# @app.route("/")
# @cross_origin()
# def members():
#     return {"messages": telegramArr}


# @app.route("/", methods=['POST'])
# @cross_origin()
# def add_message():
#     # connect.getOptionPrice("300","6/17", "AAPL", "c")
#     socketio.emit("message", request.get_data().decode("utf-8"))
#     telegramArr.append(request.get_data().decode("utf-8"))
#     return "New message", 204


# def b():
#     api_id = "12510265"

#     api_hash = "9a2309a0a34b0c8d9eee2ce409e4a30a"

#     # user_input_channel = "https://t.me/testingtestertest"

#     # client = TelegramClient('Test', api_id, api_hash).start()

#     # @client.on(events.NewMessage())
#     async def newMessage(event):
#         if event.photo:
#             print(event.photo)

#             # photo_1 = Image.open(event.message.media.photo)
#             # print(photo_1)
#             # image_buf = BytesIO()
#             # photo_1.save(image_buf, format="JPEG")
#             # image = image_buf.getvalue()
#             try:
#                 requests.post("http://127.0.0.1:5000/", event.photo)
#             except:
#                 print("image error")
#                 print(error)
#         newMessage = event.message.message
#         newMessage = re.sub(u"(\u2018|\u2019)", "'", newMessage)
#         newMessage = emoji_pattern.sub(r'', newMessage)

#         print(newMessage)
#         try:
#             requests.post("http://127.0.0.1:5000/", newMessage)
#         except:
#             print("here")
#             print(error)
#         # print(newMessage)

    # with client:
    #     client.run_until_disconnected()


if __name__ == "__main__":
    # Process(target=b).start()
    # p = Process(target=b)
    # p.start()
    # app.run(debug=True, use_reloader=False)
    socketio.run(app)
    # p.join()
