import { SocketContext, SOCKET_URL } from "./context/socket"
import React, { useState, useEffect, useContext, useCallback } from "react"
import "./Apps.css"
const axios = require("axios").default
import Chats from "./Chat/Chat"
import io from "socket.io-client"
import TradingViewWidget from "react-tradingview-widget"
import { InteractiveBroker } from "./Trading-Interface/InteractiveBroker"

const Apps = () => {
  const [firstSwitch, setFirstSwitch] = useState(false)
  const [post, setPost] = useState([])
  const [message, setMessage] = useState("")
  const [ticker, setTicker] = useState("AAPL")

  let messageParse = (message) => {
    try {
      setMessage(message)
      const regex = /[$][A-Za-z][\S]*/gm
      let m = regex.exec(message)
      if (m) setTicker(m[0].substring(1).toUpperCase())
      console.log(m[0])
    } catch (error) {
      console.log("no ticker found")
      console.log(message)
    }
  }

  const socket = useContext(SocketContext)

  const handleClick = useCallback(() => {
    socket.emit("join")
  }, [])

  useEffect(() => {
    if (!firstSwitch) {
      axios
        .get(SOCKET_URL)
        .then((res) => {
          setPost(res.data)
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
        })
        .catch((err) => {
          console.log(err)
        })
      console.log(post)
    }

    socket.on("message", messageListener)

    return () => {
      socket.off("message", messageListener)
    }
  }, [socket])

  return (
    <>
      <div id="nw" className="test">
        <Chats messages={post.messages} />
      </div>
      <div id="ne" className="test">
        <InteractiveBroker ticker={ticker} />
        <button onClick={handleClick}>Join</button>
      </div>
      <div id="sw" className="test">
        <TradingViewWidget symbol={ticker} theme="Dark" autosize />
      </div>
      <div id="se" className="test">
        test
      </div>
    </>
  )
}

export default Apps
