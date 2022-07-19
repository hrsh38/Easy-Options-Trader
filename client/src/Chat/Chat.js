import React, { useState, useRef, useEffect } from "react"
import Paper from "@mui/material/Paper"
import { MessageLeft } from "./Messages"
import "./Chat.css"

export default function Chats(props) {
  const { messageParse, setMessageParse } = props
  console.log(props)
  const scrollRef = useRef(null)
  const [list, setList] = useState([])
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behaviour: "smooth" })
    }
  }, [props])
  return (
    <>
      <Paper className="paper">
        <Paper id="style-1" className={"messagesBody"}>
          {/* <div onClick={()=>{console.log(props.messages)}}>d</div> */}
          {props.messages ? (
            props.messages.map((message, index) => {
              return (
                <MessageLeft
                  key={index}
                  message={message}
                  messageParse={messageParse}
                />
              )
            })
          ) : (
            <></>
          )}
          <div ref={scrollRef} />
        </Paper>
      </Paper>
    </>
  )
}
