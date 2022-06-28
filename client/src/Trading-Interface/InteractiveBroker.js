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
  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      // console.log(symbol, date, type, strike)
      //options: (symbol,date, type, strike)
      socket.emit("options", symbol, date, type, strike)
      setOrderStatus("")
    },
    [symbol, date, type, strike]
  )

  const handleSendOrder = useCallback(
    (e) => {
      e.preventDefault()
      // console.log(symbol, date, type, strike)
      //options: (symbol,date, type, strike)
      socket.emit(
        "place_options_order",
        symbol,
        date.split("/")[0],
        date.split("/")[1],
        type,
        strike,
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
  }, [socket])

  return (
    <div style={{ color: "white", padding: "15px" }}>
      <form onSubmit={handleClick}>
        <label>
          {"Symbol: "}
          <input
            type="text"
            name="symbol"
            value={symbol}
            onChange={(e) => {
              setSymbol(e.target.value)
            }}
          />
        </label>
        <label>
          Date:
          <input
            type="text"
            name="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
            }}
          />
        </label>
        <label>
          Type:
          <input
            type="text"
            name="type"
            value={type}
            onChange={(e) => {
              setType(e.target.value)
            }}
          />
        </label>
        <label>
          Strike:
          <input
            type="text"
            name="strike"
            value={strike}
            onChange={(e) => {
              setStrike(e.target.value)
            }}
          />
        </label>
        <input type="submit" value="Get Quote" />
      </form>
      {liveOptionsPrice !== "Invalid Input" && !stop ? (
        <>
          <OptionsPrice
            liveOptionsPrice={liveOptionsPrice}
            symbol={symbol}
            date={date}
            type={type}
            strike={strike}
            socket={socket}
            setAskPrice={setAskPrice}
          />
          <label>
            Quantity:
            <input
              type="text"
              name="quantity"
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
          <div>
            Cost:{" "}
            {(parseFloat(askPrice) * quantity * 100).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <button
            onClick={handleSendOrder}
            style={{ color: "white", background: "green" }}
          >
            SEND ORDER
          </button>
          <button
            onClick={() => {
              setStop(true)
            }}
          >
            Cancel
          </button>
          <div>{orderStatus}</div>
        </>
      ) : (
        <>{orderStatus}</>
      )}
    </div>
  )
}
