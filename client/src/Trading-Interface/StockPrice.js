import React, { useState } from "react"

export const StockPrice = (props) => {
  const { symbol, updates } = props

  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(0)

  const fecthData = React.useCallback(async () => {
    let h = fetch(
      "https://api.tdameritrade.com/v1/marketdata/quotes?" +
        new URLSearchParams({
          apikey: "DPQIIDYODNBWGFCL5S9OVVHSE0GNWMG8",
          symbol: symbol,
        })
    )
      .then((response) => response.json())
      .then((data) => {
        // console.log(data)
        const strike = data[symbol].lastPrice
        setPrice(Math.round(strike * 100) / 100)
      })
      .catch((error) => console.log(error))
  })

  React.useEffect(() => {
    setLoading(true)
    fecthData()
    console.log("updating")
    setLoading(false)
  }, [updates])
  return <>{loading ? "--" : price}</>
}
