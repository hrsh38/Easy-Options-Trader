import React from "react";
import Paper from '@mui/material/Paper';
import { MessageLeft } from "./Messages";
import "./Chat.css"


export default function Chats(props) {
  console.log(props)
  return (
    <div className="container">
      <Paper className="paper" zDepth={2}>
        <Paper id="style-1" className={"messagesBody"}>
          {props.messages !== undefined ? 
            props.messages.map(message => {
              return(<MessageLeft
            message={message}
          />)
            }):
            <></>
          }
        </Paper>
      </Paper>
    </div>
  );
}
