import React, { useState, useEffect } from "react"
import "./InteractiveBroker.css"
import { Client } from "ib-tws-api"
import { connect } from "net"

export let start = async () => {
  console.log(result)
}

export const InteractiveBroker = (props) => {
  let [firstTime, setFirstTime] = useState(false)
  useEffect(() => {
    if (!firstTime) {
      let api = new Client({
        host: "127.0.0.1",
        port: 7497,
      })
      let connect = async () => {
        let time = await api.getCurrentTime()
        console.log(time)
      }
      connect()
      setFirstTime(true)
    }
  }, [props])

  return (
    <>
      <div
        onClick={() => {
          start()
        }}
      >
        Hi
      </div>
    </>
  )
}
