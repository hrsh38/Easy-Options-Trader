from distutils.log import error
import requests
from tda import auth, client
import json
import config
import datetime
import sys
from nested_lookup import nested_lookup
from tda.orders.options import OptionSymbol, option_buy_to_open_limit, option_sell_to_close_limit, option_buy_to_open_market, option_sell_to_close_market
from tda.orders.common import Duration, Session, OrderType
from tda.orders.equities import *
from tda.client import Client
from tda.orders.generic import OrderBuilder

try:
    c = auth.client_from_token_file(config.token_path, config.api_key)
except FileNotFoundError:
    from selenium import webdriver
    with webdriver.Chrome(executable_path='/Users/harsh/Desktop/TradeAssist/chromedriver') as driver:
        c = auth.client_from_login_flow(
            driver, config.api_key, config.redirect_uri, config.token_path)

        c.get_order()

# r = c.get_price_history('AAPL',
#         period_type=client.Client.PriceHistory.PeriodType.YEAR,
#         period=client.Client.PriceHistory.Period.TWENTY_YEARS,
#         frequency_type=client.Client.PriceHistory.FrequencyType.DAILY,
#         frequency=client.Client.PriceHistory.Frequency.DAILY)
# assert r.status_code == 200, r.raise_for_status()
# print(json.dumps(r.json(), indent=4))

# strike = "300"
# date =
# type = "c"
# symbol ='AAPL'


def getOptionPrice(symbol, date, type, strike):
    # print(symbol,date, type, strike)
    year = str(datetime.date.today().year)

    try:
        callPut = c.Options.ContractType.CALL if type.upper(
        ) == "C" else c.Options.ContractType.PUT

        start_date = datetime.datetime.strptime(
            date+"/"+year, '%m/%d/%Y').date()
        end_date = datetime.datetime.strptime(
            date+"/"+year, '%m/%d/%Y').date() + datetime.timedelta(1)

        res = c.get_option_chain(symbol, contract_type=callPut, strike=int(
            strike), from_date=start_date, to_date=end_date).json()
        response = [nested_lookup('mark', res)[0], nested_lookup(
            'highPrice', res)[0], nested_lookup('lowPrice', res)[0]]

        return response

    except:
        return ["Invalid Input"]
    # response = res["callExpDateMap"][next(iter(res["callExpDateMap"]))][str(strike)+".0"][0]["mark"]
    # print(response)


def getOptionData(symbol, date, type, strike):
    print(symbol, date, type, strike)
    year = str(datetime.date.today().year)

    try:
        callPut = c.Options.ContractType.CALL if type.upper(
        ) == "C" else c.Options.ContractType.PUT

        start_date = datetime.datetime.strptime(
            date+"/"+year, '%m/%d/%Y').date()
        end_date = datetime.datetime.strptime(
            date+"/"+year, '%m/%d/%Y').date() + datetime.timedelta(1)

        res = c.get_option_chain(symbol, contract_type=callPut, strike=int(
            strike), from_date=start_date, to_date=start_date).json()
        # response = [nested_lookup('mark', res)[0], nested_lookup('highPrice', res)[0], nested_lookup('lowPrice', res)[0]]
        strikePrice = "%0.1f" % float(strike)
        response = nested_lookup(strikePrice, res)[0][0]
        # print(response)
        return response

    except:
        print(error)
        return ["Invalid Input"]

    # response = res["callExpDateMap"][next(iter(res["callExpDateMap"]))][str(strike)+".0"][0]["mark"]
    # print(response)
# print(getOptionData("$SPX.X", "3/15", "P", "3830"))
# getOptionData("SPY", "5/22", "C", "410")


def placeOptionsOrder(symbol, date_month, date_day, type, strike, quantity, ask_price):
    if (symbol == "$SPX.X"):
        symbol = "SPXW"
    try:
        todays_date = datetime.date.today()
        newSymbol = OptionSymbol(
            symbol, datetime.date(year=todays_date.year, month=int(date_month), day=int(date_day)), type, strike).build()
        # h = c.get_option_chain(newSymbol).json()
        # print(h)
        order = c.place_order(config.account_id,
                              option_buy_to_open_limit(
                                  newSymbol, int(quantity), float(ask_price))
                              .set_duration(Duration.GOOD_TILL_CANCEL)
                              .set_session(Session.NORMAL)
                              .build())
        print(order)
    except error:
        # print(order)
        print(error)
    return order
    # print(h)

# placeOptionsOrder("SPXW", "3", "6", "P", "4050", "1", "1.00")
# symbol, date_month, date_day, type, strike, quantity, ask_price


def placeOptionsOrderMarket(symbol, date_month, date_day, type, strike, quantity):
    if (symbol == "$SPX.X"):
        symbol = "SPXW"
    try:
        todays_date = datetime.date.today()
        newSymbol = OptionSymbol(
            symbol, datetime.date(year=todays_date.year, month=int(date_month), day=int(date_day)), type, strike).build()
        # h = c.get_option_chain(newSymbol).json()
        # print(h)
        order = c.place_order(config.account_id,
                              option_buy_to_open_market(
                                  newSymbol, int(quantity))
                              .set_duration(Duration.GOOD_TILL_CANCEL)
                              .set_session(Session.NORMAL)
                              .build())
        print(order)
    except error:
        # print(order)
        print(error)
    return order
    # print(h)


def getOrders():
    # start_date = datetime.datetime.now() - datetime.timedelta(10)
    orders = c.get_orders_by_path(config.account_id,
                                  max_results=10,
                                  from_entered_datetime=(
                                      datetime.datetime.today() - datetime.timedelta(days=5)),
                                  to_entered_datetime=(
                                      datetime.datetime.today() + datetime.timedelta(days=5))
                                  ).json()
    print(len(orders))
    return orders
# getOrders()


def getLastOrderStatus():
    # start_date = datetime.datetime.now() - datetime.timedelta(10)
    orders = c.get_orders_by_path(config.account_id,
                                  max_results=3,
                                  from_entered_datetime=(
                                      datetime.datetime.today() - datetime.timedelta(days=5)),
                                  to_entered_datetime=(
                                      datetime.datetime.today() + datetime.timedelta(days=5))
                                  ).json()
    print(orders[0]["status"])
    return orders[0]["status"]

# getLastOrderStatus()


def cancelOrders(id):
    res = c.cancel_order(id, config.account_id)
    # print(res)
    return res

# cancelOrders("8710515642")


def cancelAllOrders():
    orders = c.get_orders_by_query(status=Client.Order.Status.WORKING).json()
    try:
        response = nested_lookup('orderId', orders)
        res = []
        for order_id in response:
            res.append(c.cancel_order(order_id, config.account_id))
            # print(res)
        return res
    except:
        print('No orders found')
        return ['No orders found']

# cancelAllOrders()


def getPositions():
    positions = json.dumps(c.get_accounts(
        fields=[Client.Account.Fields.POSITIONS]).json(), indent=8, sort_keys=True)
    # print(positions)
    return positions

# getPositions()


def sellToClosePosition(symbol, quantity, askPrice):
    print(symbol)
    # print(option_sell_to_close_limit(
    # symbol, int(quantity), float(askPrice)).build())
    close = c.place_order(config.account_id, option_sell_to_close_limit(
        symbol, int(quantity), float(askPrice)))
    print(close)
    return close


# sellToClosePosition("SPXW_052423C4150", 1, 4)


def sellMarketPosition(symbol, quantity):
    print(symbol, quantity)
    close = c.place_order(
        config.account_id, option_sell_to_close_market(symbol, int(quantity)))
    print(close)
    return close
# sellToClosePosition('BBBY_061722C12', 1, '0.05')


def getAccountInfo():
    accountInfo = c.get_accounts().json()
    # print(accountInfo)
    return accountInfo

# getAccountInfo()


def placeStopLimitOrder(symbol, quantity, stop_price, limit_price):
    try:
        h = option_sell_to_close_limit(symbol, int(quantity), limit_price).set_order_type(
            OrderType.STOP_LIMIT).clear_price().set_stop_price(stop_price).set_price(limit_price)
        order = c.place_order(config.account_id, h)
        print(order)
        return ""
    except error:
        print(error)
        return error


def placeStopMarketOrder(symbol, quantity, stop_price):
    try:
        h = option_sell_to_close_limit(symbol, int(quantity), stop_price).set_order_type(
            OrderType.STOP).clear_price().set_stop_price(stop_price)
        order = c.place_order(config.account_id, h)
        print(order)
        return ""
    except error:
        print(error)
        return error


def placeTrailingStopLimit(symbol, quantity, stop_price):
    try:
        print("hi")
    except error:
        print(error)


# placeStopMarketOrder("SPXW_052423C4150", 1, 0.05)

def getOrdersForStop(symbol):
    print(symbol)
    # start_date = datetime.datetime.now() - datetime.timedelta(10)
    orders = c.get_orders_by_path(config.account_id,
                                  max_results=50,
                                  from_entered_datetime=(
                                      datetime.datetime.today() - datetime.timedelta(days=5)),
                                  to_entered_datetime=(
                                      datetime.datetime.today() + datetime.timedelta(days=5))
                                  ).json()

    # print(orders)
    symbol_orders = [order for order in orders if order['orderLegCollection']
                     [0]['instrument']['symbol'] == symbol and order['status'] != 'FILLED' and order['status'] != 'CANCELED' and order['status'] != 'REJECTED']
    # print(len(orders))
    return symbol_orders


# getOrdersForStop("TSLA_060923C225")
# getOrdersForStop("AMZN_052623C118")

def cancelOrdersFromId(symbol):
    print(symbol)
    # start_date = datetime.datetime.now() - datetime.timedelta(10)
    orders = c.get_orders_by_path(config.account_id,
                                  max_results=50,
                                  from_entered_datetime=(
                                      datetime.datetime.today() - datetime.timedelta(days=5)),
                                  to_entered_datetime=(
                                      datetime.datetime.today() + datetime.timedelta(days=5))
                                  ).json()

    # print(orders)
    symbol_orders = [order for order in orders if order['orderLegCollection']
                     [0]['instrument']['symbol'] == symbol and order['status'] != 'FILLED' and order['status'] != 'CANCELED' and order['status'] != 'REJECTED']
    # print(len(orders))
    # print(symbol_orders)
    for orders in symbol_orders:
        cancelOrders(orders['orderId'])
    return symbol_orders
