import React, { useState, useEffect } from "react";
import "./App.css";
const axios = require("axios").default;
import Chats from "./Chat/Chat";
import io from "socket.io-client";
import TradingViewWidget from "react-tradingview-widget";
import { TDA } from "./TDA-Interface/Tda";

const App = () => {
  const [firstSwitch, setFirstSwitch] = useState(false);
  const [socket, setSocket] = useState(null);
  const [post, setPost] = useState([]);
  const [message, setMessage] = useState("");
  const [ticker, setTicker] = useState("AAPL");
  const url = "http://127.0.0.1:5000/";

  let messageParse = (message) => {
    setMessage(message);
    const regex = /[$][A-Za-z][\S]*/gm;
    let m = regex.exec(message);
    if (m) setTicker(m[0].substring(1).toUpperCase());
    console.log(m[0]);
  };

  useEffect(() => {
    if (!firstSwitch) {
      axios
        .get(url)
        .then((res) => {
          setPost(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(post);
      setFirstSwitch(true);
    }

    const socket = io(url);
    const messageListener = (message) => {
      axios
        .get(url)
        .then((res) => {
          setPost(res.data);
          messageParse(message);
        })
        .catch((err) => {
          console.log(err);
        });
      console.log(post);
    };

    const deleteMessageListener = (messageID) => {
      setMessages((prevMessages) => {
        const newMessages = { ...prevMessages };
        delete newMessages[messageID];
        return newMessages;
      });
    };

    socket.on("message", messageListener);

    return () => {
      socket.off("message", messageListener);
    };
  }, [socket]);

  // const [post, setPost]=useState([])
  // const url="http://127.0.0.1:5000/"
  // const WAIT_TIME = 5000;

  // useEffect(() => {
  //     const id = setInterval(() => {
  //     axios
  //     .get(url)
  //     .then(res=>{
  //     setPost(res.data);
  //     })
  //     .catch(err=>{
  //     console.log(err);
  //     })
  //     }, WAIT_TIME);
  //     return () => clearInterval(id);
  // }, [post]);

  return (
    <>
      <div id="nw" className="test">
        <Chats messages={post.messages} />
      </div>
      <div id="ne" className="test">
        <TDA />
      </div>
      <div id="sw" className="test">
        <TradingViewWidget symbol={ticker} theme="Dark" autosize />
      </div>
      <div id="se" className="test">
        test
      </div>
    </>
  );
};

export default App;
