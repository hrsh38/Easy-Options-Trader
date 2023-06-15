import { Button } from "@mui/material"
import React from "react"

export const CancelAllOrders = (props) => {
  const { currSymbol, socket } = props
  const handleClick = (e) => {
    socket.emit("cancelOrdersFromId", currSymbol)
  }
  return (
    <>
      <Button variant="outlined" color="error" onClick={handleClick}>
        Cancel
      </Button>
    </>
  )
}
