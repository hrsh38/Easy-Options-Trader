import React from "react"

export const OptionsPrice = (props) => {
  const {
    liveOptionsPrice,
    symbol,
    date,
    type,
    strike,
    socket,
    setAskPrice,
    lowLiveOptionsPrice,
    highLiveOptionsPrice,
  } = props

  React.useEffect(() => {
    const interval = setInterval(() => {
      socket.emit("options", symbol, date, type, strike)
    }, 3000)

    return () => clearInterval(interval) // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  })
  return (
    <>
      <div className="order-info">
        <div>{symbol}</div>
        {"\u00A0"}
        <div>{date}</div>
        {"\u00A0$"}
        <div>{strike}</div>
        {"\u00A0"}
        <div style={type === "C" ? { color: "green" } : { color: "red" }}>
          {type}
        </div>
      </div>
      <div
        onClick={() => {
          setAskPrice(liveOptionsPrice)
        }}
        className="options-price"
        style={{ cursor: "pointer" }}
      >
        {liveOptionsPrice}
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "10px",
        }}
      >
        <div>Low: {lowLiveOptionsPrice}</div>
        <div>High: {highLiveOptionsPrice}</div>
      </div>
    </>
  )
}
