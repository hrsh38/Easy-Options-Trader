from tda import auth, client
import json
import config
import datetime



try:
    c = auth.client_from_token_file(config.token_path, config.api_key)
except FileNotFoundError:
    from selenium import webdriver
    with webdriver.Chrome(executable_path=r'C:\Users\harsh\Desktop\TradeAssist/chromedriver') as driver:
        c = auth.client_from_login_flow(
            driver, config.api_key, config.redirect_uri, config.token_path)

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
    callPut = c.Options.ContractType.CALL if type.upper() == "C" else c.Options.ContractType.PUT



    start_date = datetime.datetime.strptime(date+"/2022", '%m/%d/%Y').date();
    end_date = datetime.datetime.strptime(date+"/2022", '%m/%d/%Y').date();


    res = c.get_option_chain(symbol, contract_type=callPut, strike=int(strike), from_date=start_date, to_date=end_date).json()

    response = res["callExpDateMap"][next(iter(res["callExpDateMap"]))][str(strike)+".0"][0]["mark"]
    print(response)

getOptionPrice("AMZN", "6/17", "C", "130")
