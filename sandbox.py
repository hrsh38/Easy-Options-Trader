from distutils.log import error
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


def getOptionData(symbol, date, type, strike):
    # print(symbol, date, type, strike)
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
        # strikePrice = "%0.1f" % float(strike)
        # response = [nested_lookup(strikePrice, res)[0][0]]
        # response = [nested_lookup('mark', res)[0], nested_lookup(
        #     'delta', res)[0], nested_lookup('vega', res)[0], nested_lookup('theta', res)[0],
        #     nested_lookup('gamma ', res)[0], nested_lookup('tho', res)[0], nested_lookup('volatility', res)[0]]
        # print(res)
        response = [strike, type,
                    nested_lookup('mark', res)[0],
                    nested_lookup('delta', res)[0],
                    nested_lookup('vega', res)[0],
                    nested_lookup('theta', res)[0],
                    nested_lookup('gamma', res)[0],
                    nested_lookup('rho', res)[0],
                    nested_lookup('volatility', res)[0]]
        return response

    except:
        print(error)
        return ["Invalid Input"]


# print(getOptionData("$SPX.X", "3/20", "P", "3830"))
ticker = "$SPX.X"
date = "3/20"
# currentPrice = 3915
# type = "P"

data = []
for i in range(-100, 100, 5):
    if (i == 0):
        type = "C"
print(3920+i, type)
data.append(getOptionData(ticker, date, type, 3920+i))


# print(data[0])
# print(data[36])
left = 0
right = 39

potentialPuts = []
potentialCalls = []

while (left < right):
    diffLeft = abs(3-data[left][2])
    diffRight = abs(3-data[right][2])

    if (diffLeft <= 0.5):
        potentialPuts.append(data[left])
    if (diffRight <= 0.5):
        potentialCalls.append(data[right])
    left = left+1
    right = right-1

print(potentialCalls)
print(potentialPuts)