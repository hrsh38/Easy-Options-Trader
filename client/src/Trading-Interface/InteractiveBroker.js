import React, { useState, useEffect, useCallback } from "react"
import "./InteractiveBroker.css"

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

  const handleClick = useCallback(
    (e) => {
      e.preventDefault()
      console.log(symbol, date, type, strike)
      //options: (symbol,date, type, strike)
      socket.emit("options", symbol, date, type, strike)
    },
    [symbol, date, type, strike]
  )

  useEffect(() => {
    const messageListener = (message) => {
      setLiveOptionsPrice(message)
    }
    socket.on("liveOptions", messageListener)
    return () => {
      socket.off("liveOptions", messageListener)
    }
  }, [socket])

  return (
    <div style={{ color: "white" }}>
      <form onSubmit={handleClick}>
        <label>
          Symbol:
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
        <input type="submit" value="Submit" />
      </form>
      <div onClick={() => {}}>{liveOptionsPrice}</div>
    </div>
  )
}
