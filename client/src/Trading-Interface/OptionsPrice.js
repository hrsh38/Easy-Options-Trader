import React from "react"

export const OptionsPrice = (props) => {
  const { liveOptionsPrice, symbol, date, type, strike, socket, setAskPrice } =
    props

  React.useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("options", symbol, date, type, strike)
    }, 3000)

    return () => clearInterval(interval) // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  })
  return (
    <>
      <div
        onClick={() => {
          setAskPrice(liveOptionsPrice)
        }}
        style={{ cursor: "pointer" }}
      >
        {"Live Options Price: "}
        {liveOptionsPrice}
      </div>
    </>
  )
}
