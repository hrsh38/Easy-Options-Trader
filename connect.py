import requests
from tda import auth, client
import json
import config
import datetime
import sys
from nested_lookup import nested_lookup
from tda.orders.options import OptionSymbol, option_buy_to_open_limit, option_sell_to_close_limit
from tda.orders.common import Duration, Session
from tda.client import Client

try:
    c = auth.client_from_token_file(config.token_path, config.api_key)
except FileNotFoundError:
    from selenium import webdriver
    with webdriver.Chrome(executable_path=r'C:\Users\harsh\Desktop\TradeAssist/chromedriver') as driver:
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


def getOptionPrice(symbol,date, type, strike):
    # print(symbol,date, type, strike)
    try:
        callPut = c.Options.ContractType.CALL if type.upper() == "C" else c.Options.ContractType.PUT



        start_date = datetime.datetime.strptime(date+"/2022", '%m/%d/%Y').date();
        end_date = datetime.datetime.strptime(date+"/2022", '%m/%d/%Y').date() + datetime.timedelta(1);


        res = c.get_option_chain(symbol, contract_type=callPut, strike=int(strike), from_date=start_date, to_date=end_date).json()
        # print(res)
        response = nested_lookup('mark', res)
        return response[0]

    except:
        return "Invalid Input"
    # response = res["callExpDateMap"][next(iter(res["callExpDateMap"]))][str(strike)+".0"][0]["mark"]
    # print(response)

# print(getOptionPrice("SPX", "?6/13", "P", "3800"))

def placeOptionsOrder(symbol, date_month, date_day, type, strike, quantity, ask_price):

    newSymbol = OptionSymbol(
    symbol, datetime.date(year=2022, month=int(date_month), day=int(date_day)), type, strike).build()
    print(newSymbol)
    # h = c.get_option_chain(newSymbol).json()
    order = c.place_order(config.account_id,
                  option_buy_to_open_limit(newSymbol, int(quantity), float(ask_price))
                  .set_duration(Duration.GOOD_TILL_CANCEL)
                  .set_session(Session.NORMAL)
                  .build())
    print(order)
    return order
    # print(h)
# symbol, date_month, date_day, type, strike, quantity, ask_price
# placeOptionsOrder("SPXW", "6", "13", "P", "3800", "1", "0.01")

def getOrders():
    # start_date = datetime.datetime.now() - datetime.timedelta(10)
    orders = c.get_orders_by_query(max_results=5).json()
    # print(orders)
    return orders
# getOrders()


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
    positions = json.dumps(c.get_accounts(fields=[Client.Account.Fields.POSITIONS]).json(), indent=4, sort_keys=True)
    # print(positions)
    return positions

# getPositions()

def sellToClosePosition(symbol, quantity, askPrice):
    close = c.place_order(config.account_id, option_sell_to_close_limit(symbol,quantity,askPrice ))
    print(close)
    return close

# sellToClosePosition('BBBY_061722C12', 1, '0.05')

