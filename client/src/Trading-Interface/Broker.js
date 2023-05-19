import React, { useState, useEffect, useCallback } from "react"
import "./Broker.css"
import { OptionsPrice } from "./OptionsPrice"
import TextField from "@mui/material/TextField"
import { Watchlist } from "./Watchlist"

export const Broker = (props) => {
  const {
    socket,
    symbol,
    date,
    type,
    strike,
    setSymbol,
    setDate,
    setType,
    setStrike,
    sendAlert,
  } = props
  const [greeks, setGreeks] = React.useState([])
  const [liveOptionsPrice, setLiveOptionsPrice] = React.useState("")
  const [highLiveOptionsPrice, setHighLiveOptionsPrice] = React.useState("")
  const [lowLiveOptionsPrice, setLowLiveOptionsPrice] = React.useState("")
  const [stop, setStop] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)
  const [askPrice, setAskPrice] = React.useState(0)
  const [orderStatus, setOrderStatus] = React.useState("")
  const [firstTime, setFirstTime] = React.useState(true)
  const [weeklyOffsetInput, setWeeklyOffsetInput] = React.useState(0)
  const [recentStocks, setRecentStocks] = React.useState({
    SPY: "SPY",
    "$SPX.X": "$SPX.X",
    QQQ: "QQQ",
    AAPL: "AAPL",
    TSLA: "TSLA",
    META: "META",
    AMZN: "AMZN",
  })
  const [currentOrderInfo, setCurrentOrderInfo] = React.useState("")
  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      //options: (symbol,date, type, strike)
      socket.emit("options", symbol, date, type, strike)
      socket.emit("getOptionsData", symbol, date, type, strike)
      setOrderStatus("")
      setAskPrice(0)
    },
    [symbol, date, type, strike]
  )
  const [watchListArr, setWatchListArr] = React.useState([])
  const handleWatchListEntry = () => {
    let tempArr = watchListArr

    tempArr.push([symbol, date, type, strike])
    console.log(tempArr)
    setStop(true)
    setQuantity(1)
    setWatchListArr(tempArr)
    console.log(tempArr.toString())
    let localObj = { watchList: tempArr }
    localStorage.setItem("watchListArr", JSON.stringify(localObj))
  }
  const handleQuoteFromWatchList = (watchLisItem) => {
    // let watchLisItem = ["MU", "5/12", "C", 62]
    setSymbol(watchLisItem[0])
    setDate(watchLisItem[1])
    setType(watchLisItem[2])
    setStrike(watchLisItem[3])
    socket.emit(
      "options",
      watchLisItem[0],
      watchLisItem[1],
      watchLisItem[2],
      watchLisItem[3]
    )
    socket.emit(
      "getOptionsData",
      watchLisItem[0],
      watchLisItem[1],
      watchLisItem[2],
      watchLisItem[3]
    )
    setOrderStatus("")
    setAskPrice(0)
  }

  const handleSendOrder = useCallback(
    (e) => {
      e.preventDefault()
      //options: (symbol,date, type, strike)
      socket.emit(
        "place_options_order",
        symbol,
        date.split("/")[0],
        date.split("/")[1],
        type,
        strike + "",
        quantity,
        askPrice
      )
      setQuantity(1)
    },
    [symbol, date, type, strike, quantity, askPrice]
  )
  const handleMarketOrder = useCallback(
    (e) => {
      e.preventDefault()
      //options: (symbol,date, type, strike)

      socket.emit(
        "place_options_order_market",
        symbol,
        date.split("/")[0],
        date.split("/")[1],
        type,
        strike + "",
        quantity
      )
      setQuantity(1)
      setTimeout(() => {
        socket.emit("getPositions")
      }, 3000)
      setTimeout(() => {
        socket.emit("getPositions")
      }, 5000)
    },
    [symbol, date, type, strike, quantity]
  )
  useEffect(() => {
    const messageListener = (message) => {
      setLiveOptionsPrice(message[0])
      if (message !== "Invalid Input") {
        setLiveOptionsPrice(message[0])
        setHighLiveOptionsPrice(message[1])
        setLowLiveOptionsPrice(message[2])
        setStop(false)
        if (!recentStocks.hasOwnProperty(symbol)) {
          setRecentStocks((prevState) => ({ ...prevState, [symbol]: symbol }))
        }
        setCurrentOrderInfo(symbol + "  " + date + "  $" + strike + "" + type)
        setOrderStatus("")
      } else {
        setOrderStatus(message)
      }
    }
    const orderStatusUpdate = (message) => {
      console.log(message)
      if (message === "<Response [201 ]>") {
        sendAlert("Order Sent Succesfully", "success")
      } else {
        sendAlert("Error Sending Order", "error")
      }
      setOrderStatus(message)
      if (message.indexOf("20")) {
        setTimeout(() => {
          socket.emit("getOrders")
        }, 2000)
        setStop(true)
      }
    }

    const optionsData = (message) => {
      // console.log(message)
      let greeksTemp = [
        message.delta,
        message.vega,
        message.theta,
        message.gamma,
        message.rho,
        message.volatility,
      ]
      // console.log(greeksTemp)
      setGreeks(greeksTemp)
    }
    socket.on("liveOptions", messageListener)
    socket.on("orderStatus", orderStatusUpdate)
    socket.on("liveOptionsData", optionsData)
    // if (firstTime) {
    //   socket.emit("options", symbol, date, type, strike)
    //   setOrderStatus("")
    // }
    return () => {
      socket.off("liveOptions", messageListener)
      socket.off("orderStatus", orderStatusUpdate)
      socket.off("liveOptionsData", optionsData)
    }
  }, [socket, symbol, date, type, strike])

  const handleDateClick = (input) => {
    var curr = new Date()
    console.log(curr)
    var lastday
    setWeeklyOffsetInput(0)
    if (input === "today") {
      setDate(curr.getMonth() + 1 + "/" + curr.getDate())
    } else if (input === "tomorrow") {
      lastday = new Date(curr.setDate(curr.getDate() + 1))
      setDate(lastday.getMonth() + 1 + "/" + lastday.getDate())
    } else if (input === "EOW") {
      lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 5))
      setDate(lastday.getMonth() + 1 + "/" + lastday.getDate())
    }
  }

  const handleDateClickWeekly = (input) => {
    setWeeklyOffsetInput(weeklyOffsetInput + input)
    let curr = new Date()
    let lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 5))
    lastday.setDate(lastday.getDate() + (input + weeklyOffsetInput) * 7)
    console.log(lastday)
    setDate(lastday.getMonth() + 1 + "/" + lastday.getDate())
  }

  const getCurrStock = async (s) => {
    s = s ? s : symbol
    console.log(s)
    let h = fetch(
      "https://api.tdameritrade.com/v1/marketdata/quotes?" +
        new URLSearchParams({
          apikey: "DPQIIDYODNBWGFCL5S9OVVHSE0GNWMG8",
          symbol: s,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        const strike = Math.floor(data[s].lastPrice)
        setStrike(strike)
        socket.emit("options", s, date, type, strike)
        socket.emit("getOptionsData", s, date, type, strike)
      })
  }

  return (
    <>
      <div className="top-section">
        <div
          style={{
            color: "white",
            padding: "15px",
            height: "100%",
            // overflow: "scroll",
            height: "-webkit-fill-available",
          }}
          onKeyDown={(e) => {
            // setStop(true)
            // setAskPrice(0)
            // if (e.key === "Enter") {
            //   handleClick()
            // }
          }}
        >
          <div className="quote-form">
            <form onSubmit={handleClick}>
              <label>
                {"Symbol: "}
                <div className="datefield">
                  <input
                    type="text"
                    id="symbol"
                    name="symbol"
                    value={symbol}
                    onChange={(e) => {
                      setSymbol(e.target.value)
                    }}
                  />
                  <div className="recent-stocks">
                    {Object.keys(recentStocks).map((key, index) => {
                      return (
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            setSymbol(recentStocks[key])
                            getCurrStock(recentStocks[key])
                          }}
                          key={index}
                          style={{ width: "33.3%" }}
                        >
                          {key}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </label>
              <label>
                Date:
                <div className="datefield">
                  <input
                    type="text"
                    name="date"
                    value={date}
                    onChange={(e) => {
                      setDate(e.target.value)
                    }}
                  />
                  <div style={{ width: "100%" }}>
                    <button
                      tabIndex="-1"
                      style={{ width: "30%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        handleDateClick("today")
                      }}
                    >
                      Today
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "40%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        handleDateClick("tomorrow")
                      }}
                    >
                      Tomorrow
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "30%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        handleDateClick("EOW")
                      }}
                    >
                      Friday
                    </button>
                  </div>
                  <div style={{ width: "100%" }}>
                    <button
                      tabIndex="-1"
                      style={{ width: "50%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        handleDateClickWeekly(-1)
                      }}
                    >
                      -1 Week
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "50%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        handleDateClickWeekly(1)
                      }}
                    >
                      +1 Week
                    </button>
                  </div>
                </div>
              </label>
              <label>
                Type:
                <div className="datefield">
                  <input
                    type="text"
                    name="type"
                    value={type}
                    onChange={(e) => {
                      setType(e.target.value)
                    }}
                  />
                  <div>
                    <button
                      tabIndex="-1"
                      style={{ width: "50%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        setType("P")
                      }}
                    >
                      Put
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "50%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        setType("C")
                      }}
                    >
                      Call
                    </button>
                  </div>
                </div>
              </label>
              <label>
                Strike:
                <div className="datefield">
                  <input
                    type="text"
                    name="strike"
                    value={strike}
                    onChange={(e) => {
                      setStrike(e.target.value)
                    }}
                  />
                  <div>
                    <button
                      tabIndex="-1"
                      style={{ width: "17%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        setStrike(strike - 5)
                      }}
                    >
                      -5
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "17%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        setStrike(strike - 1)
                      }}
                    >
                      -1
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "32%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        getCurrStock()
                      }}
                    >
                      Current
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "17%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        setStrike(strike + 1)
                      }}
                    >
                      +1
                    </button>
                    <button
                      tabIndex="-1"
                      style={{ width: "17%" }}
                      onClick={(e) => {
                        //e.preventDefault()
                        setStrike(strike + 5)
                      }}
                    >
                      +5
                    </button>
                  </div>
                </div>
              </label>
              <div style={{}}>
                <div className="quote-button">
                  <input
                    type="submit"
                    value="GET QUOTE"
                    className="get-quote-button"
                  />
                </div>
              </div>
            </form>
          </div>
          <div className="quote-book">
            {liveOptionsPrice !== "Invalid Input" && !stop ? (
              <>
                <div className="quote-left">
                  {/* <div className="order-info">{currentOrderInfo}</div> */}
                  <OptionsPrice
                    liveOptionsPrice={liveOptionsPrice}
                    symbol={symbol}
                    date={date}
                    type={type}
                    strike={strike}
                    socket={socket}
                    setAskPrice={setAskPrice}
                    lowLiveOptionsPrice={lowLiveOptionsPrice}
                    highLiveOptionsPrice={highLiveOptionsPrice}
                    greeks={greeks}
                  />
                  <button
                    className="add-to-watchlist"
                    onClick={handleWatchListEntry}
                  >
                    ADD TO WATCHLIST
                  </button>
                </div>
                <div className="quote-right">
                  <div className="quote-right-top">
                    <label>
                      Quantity:
                      <input
                        type="number"
                        name="quantity"
                        min={1}
                        value={quantity}
                        onChange={(e) => {
                          setQuantity(e.target.value)
                        }}
                      />
                    </label>
                    <label>
                      Ask Price:
                      <input
                        type="text"
                        name="askPrice"
                        value={askPrice}
                        onChange={(e) => {
                          setAskPrice(e.target.value)
                        }}
                      />
                    </label>
                    <button
                      className="send-button-broker"
                      onClick={handleSendOrder}
                      // style={{ color: "white", background: "green" }}
                    >
                      SEND
                    </button>
                    <button
                      className="cancel-button-broker"
                      onClick={() => {
                        setStop(true)
                        setQuantity(1)
                      }}
                    >
                      CANCEL
                    </button>
                    <button
                      className="send-button-broker"
                      onClick={handleMarketOrder}
                    >
                      MARKET
                    </button>
                  </div>
                  <div style={{ marginTop: "13px" }}>
                    Cost:{" "}
                    {(parseFloat(askPrice) * quantity * 100).toLocaleString(
                      "en-US",
                      {
                        style: "currency",
                        currency: "USD",
                      }
                    )}
                  </div>
                  <div className="text-tag">
                    Help
                    <div className="img-container">
                      <img
                        src={
                          "https://tradeoptionswithme.com/wp-content/uploads/2017/04/FullSizeRender-1-1.jpg"
                        }
                        width={300}
                        height={150}
                        alt="Greeks"
                      ></img>
                    </div>
                  </div>
                  {/* <div>{orderStatus}</div> */}
                </div>
              </>
            ) : (
              <>{orderStatus || "Invalid Input"}</>
            )}
          </div>
        </div>
        <div>
          <Watchlist
            watchListArr={watchListArr}
            handleQuoteFromWatchList={handleQuoteFromWatchList}
            setWatchListArr={setWatchListArr}
          ></Watchlist>
        </div>
      </div>
    </>
  )
}
