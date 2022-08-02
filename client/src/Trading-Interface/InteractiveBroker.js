import React, { useState, useEffect, useCallback } from "react"
import "./InteractiveBroker.css"
import { OptionsPrice } from "./OptionsPrice"
import TextField from "@mui/material/TextField"

export const InteractiveBroker = (props) => {
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
  } = props
  const [liveOptionsPrice, setLiveOptionsPrice] = React.useState("")
  const [stop, setStop] = React.useState(true)
  const [quantity, setQuantity] = React.useState(1)
  const [askPrice, setAskPrice] = React.useState(0)
  const [orderStatus, setOrderStatus] = React.useState("")
  const [firstTime, setFirstTime] = React.useState(true)
  const [recentStocks, setRecentStocks] = React.useState({
    SPY: "SPY",
    "$SPX.X": "$SPX.X",
    QQQ: "QQQ",
  })
  const [currentOrderInfo, setCurrentOrderInfo] = React.useState("")
  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      //options: (symbol,date, type, strike)
      socket.emit("options", symbol, date, type, strike)
      setOrderStatus("")
    },
    [symbol, date, type, strike]
  )

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
    },
    [symbol, date, type, strike, quantity, askPrice]
  )

  useEffect(() => {
    const messageListener = (message) => {
      setLiveOptionsPrice(message)
      if (message !== "Invalid Input") {
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
      setOrderStatus(message)
      if (message.indexOf("20")) {
        setTimeout(() => {
          socket.emit("getOrders")
        }, 2000)
        setStop(true)
      }
    }
    socket.on("liveOptions", messageListener)
    socket.on("orderStatus", orderStatusUpdate)

    // if (firstTime) {
    //   socket.emit("options", symbol, date, type, strike)
    //   setOrderStatus("")
    // }
    return () => {
      socket.off("liveOptions", messageListener)
      socket.off("orderStatus", orderStatusUpdate)
    }
  }, [socket, symbol, date, type, strike])

  const handleDateClick = (input) => {
    var curr = new Date()
    var lastday
    if (input === "today") {
      setDate(curr.getMonth() + 1 + "/" + curr.getDay())
    } else if (input === "tomorrow") {
      lastday = new Date(curr.setDate(curr.getDate() + 1))
      setDate(lastday.getMonth() + 1 + "/" + lastday.getDay())
    } else if (input === "EOW") {
      lastday = new Date(curr.setDate(curr.getDate() - curr.getDay() + 5))
      setDate(lastday.getMonth() + 1 + "/" + lastday.getDay())
    }
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
      })
  }

  return (
    <div
      style={{
        color: "white",
        padding: "15px",
        height: "100%",
        // overflow: "scroll",
        height: "-webkit-fill-available",
      }}
      onKeyDown={(e) => {
        setStop(true)
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
                  EOW
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
                    setType("C")
                  }}
                >
                  Call
                </button>
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
          <div className="quote-button">
            <input
              type="submit"
              value="GET QUOTE"
              className="get-quote-button"
            />
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
              />
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
                  className="send-button"
                  onClick={handleSendOrder}
                  // style={{ color: "white", background: "green" }}
                >
                  SEND
                </button>
                <button
                  className="cancel-button"
                  onClick={() => {
                    setStop(true)
                  }}
                >
                  CANCEL
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
              {/* <div>{orderStatus}</div> */}
            </div>
          </>
        ) : (
          <>{orderStatus}</>
        )}
      </div>
    </div>
  )
}
