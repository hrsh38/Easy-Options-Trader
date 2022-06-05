
import React, { useState, useEffect } from 'react';
import "./App.css";
const axios = require('axios').default;
import  Chats  from "./Chat/Chat"


const App = () => {
    // let ws = new WebSocket('ws://127.0.0.1:5000/')
    // const [post, setPost] = useState([])
  
  
    // useEffect(() => {
    //   this.ws.onopen = () => {
    //     console.log("connected")
    //   }
  
    //   this.ws.onmessage = event => {
    //     const message = JSON.parse(event.data)
    //     console.log(message)
    //   }
  
    //   this.ws.onclose = () => {
    //     console.log("disconnect")
    //   }
    // });

    const [post, setPost]=useState([])
    const url="http://127.0.0.1:5000/"
    const WAIT_TIME = 5000;

    useEffect(() => {
        const id = setInterval(() => {
        axios
        .get(url)
        .then(res=>{
        setPost(res.data);
        })
        .catch(err=>{
        console.log(err);
        })
        }, WAIT_TIME);
        return () => clearInterval(id);
    }, [post]); 

  return (
    <div>
      <h1 className="heading">Trade Assist</h1>
      <h4 className="sub-heading">
            <Chats messages={post.messages}/>
       </h4>
    </div>
  );
};
 
export default App;