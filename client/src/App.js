
import React, { useState, useEffect } from 'react';
import "./App.css";
const axios = require('axios').default;
import  Chats  from "./Chat/Chat"
import io from 'socket.io-client';
import TradingViewWidget from 'react-tradingview-widget';



const App = () => {
    const [socket, setSocket] = useState(null);
    const [post, setPost]=useState([])
    const [ticker, setTicker] = useState("AAPL")
    const url="http://127.0.0.1:5000/"

    let messageParse=(message) => {
      const regex = /[$][A-Za-z][\S]*/gm;
      let m = regex.exec(message)
      if(m) setTicker(m[0].substring(1).toUpperCase())
      console.log(m[0])
    }

    useEffect(() => {
      const socket = io(`http://127.0.0.1:5000/`);
      const messageListener = (message) => {
        axios
        .get(url)
        .then(res=>{
        setPost(res.data);
        messageParse(message)
        })
        .catch(err=>{
        console.log(err);
        })
        console.log(post)
      };
    
      const deleteMessageListener = (messageID) => {
        setMessages((prevMessages) => {
          const newMessages = {...prevMessages};
          delete newMessages[messageID];
          return newMessages;
        });
      };
    
      socket.on('message', messageListener);
  
      return () => {
        socket.off('message', messageListener);
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

      <div id="nw" className="test"><Chats messages={post.messages}/></div>
      <div id="ne" className="test">test</div>
      <div id="sw" className="test">
        <TradingViewWidget 
          symbol ={ticker}
          theme={"dark"}
          locale="fr"
          autosize
        />
      </div>
      <div id="se" className="test">test</div>            
            
    </>
  );
};
 
export default App;