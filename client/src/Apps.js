import { SocketContext, SOCKET_URL } from "./context/socket"
import React, { useState, useEffect, useContext, useCallback } from "react"
import "./Apps.css"
const axios = require("axios").default
import Chats from "./Chat/Chat"
import io from "socket.io-client"
import TradingViewWidget from "react-tradingview-widget"
import { InteractiveBroker } from "./Trading-Interface/InteractiveBroker"
import { Account } from "./Account/Account"
const Apps = () => {
  const [firstSwitch, setFirstSwitch] = useState(false)
  const [post, setPost] = useState([])
  const [message, setMessage] = useState("")
  const [liveOptionsPrice, setLiveOptionsPrice] = useState("")

  const [symbol, setSymbol] = React.useState("SPY")
  const [date, setDate] = React.useState("")
  const [type, setType] = React.useState("")
  const [strike, setStrike] = React.useState("")

  let messageParse = (message) => {
    message = message.toUpperCase()
    try {
      setMessage(message)
      const regex = /[$][A-Za-z][\S]*/gm
      let m = regex.exec(message)
      if (m) {
        // setTicker(m[0].substring(1).toUpperCase())
        setSymbol(m[0].substring(1).toUpperCase())
      }
      let arr = message.split(" ")
      arr.forEach((item) => {
        if (item.indexOf("$") !== -1) {
          if (item.indexOf("C") !== -1) {
            setType("C")
            setStrike(item.substring(1).slice(0, -1))
          } else {
            if (item.indexOf("P") !== -1) {
              setType("P")
              setStrike(item.substring(1).slice(0, -1))
            }
            setStrike(item.substring(1))
          }
        } else if (item.indexOf("C") !== -1) {
          setType("C")
        } else if (item.indexOf("P") !== -1) {
          setType("P")
        } else if (item.indexOf("/") !== -1) {
          setDate(item)
        }
      })

      console.log(m[0])
    } catch (error) {
      console.log("no ticker found")
      console.log(message)
    }
  }

  const socket = useContext(SocketContext)

  const handleClick = useCallback((symbol, date, type, strike) => {
    //options: (symbol,date, type, strike)
    // socket.emit("options", symbol, date, type, strike)
  }, [])

  useEffect(() => {
    if (!firstSwitch) {
      axios
        .get(SOCKET_URL)
        .then((res) => {
          setPost(res.data)
          console.log(res.data)
          messageParse(res.data.messages[res.data.messages.length - 1])
        })
        .catch((err) => {
          console.log(err)
        })
      console.log(post)
      setFirstSwitch(true)
    }
    const messageListener = (message) => {
      axios
        .get(SOCKET_URL)
        .then((res) => {
          setPost(res.data)
          messageParse(message)
          document.getElementById("audio").play()
        })
        .catch((err) => {
          console.log(err)
        })
      // console.log(post)
    }

    socket.on("message", messageListener)
    return () => {
      socket.off("message", messageListener)
    }
  }, [socket])

  return (
    <>
      <div id="nw" className="test">
        <Chats messages={post.messages} messageParse={messageParse} />
      </div>
      <div id="ne" className="test">
        <InteractiveBroker
          socket={socket}
          symbol={symbol}
          date={date}
          type={type}
          strike={strike}
          setSymbol={setSymbol}
          setDate={setDate}
          setType={setType}
          setStrike={setStrike}
        />
        {/* <button onClick={handleClick}>Join</button> */}
      </div>
      <div id="sw" className="test">
        <TradingViewWidget symbol={symbol} theme="Dark" autosize />
      </div>
      <div id="se" className="test">
        <Account
          socket={socket}
          symbol={symbol}
          date={date}
          type={type}
          strike={strike}
          setSymbol={setSymbol}
          setDate={setDate}
          setType={setType}
          setStrike={setStrike}
        />
      </div>
    </>
  )
}

export default Apps
