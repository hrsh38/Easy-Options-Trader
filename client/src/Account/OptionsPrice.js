import React from "react"

export const OptionsPrice = (props) => {
  const { currSymbol, socket } = props
  const [liveOptionsPrice, setLiveOptionsPrice] = React.useState("")

  React.useEffect(() => {
    const interval = setInterval(() => {
      let arr = currSymbol.match(/[a-zA-Z]+|[0-9]+/gm)
      let symbol = arr[0],
        date = arr[1].substring(0, 2) + "/" + arr[1].substring(2, 4),
        type = arr[2],
        strike = arr[3]
      console.log(arr)
      socket.emit("getOptionsPriceUpdate", symbol, date, type, strike)
    }, 3000)

    const optionsPriceUpdate = (message) => {
      console.log(message)
      setLiveOptionsPrice(message)
    }
    socket.on("liveOptionsUpdate", optionsPriceUpdate)

    return () => {
      clearInterval(interval)
      socket.off("liveOptionsUpdate", optionsPriceUpdate)
    } // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  })
  return <>{liveOptionsPrice}</>
}
