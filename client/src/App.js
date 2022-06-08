import { SocketContext, socket } from "./context/socket"
import Apps from "./Apps"
import React from "react"

const App = () => {
  return (
    <SocketContext.Provider value={socket}>
      <Apps />
    </SocketContext.Provider>
  )
}

export default App
