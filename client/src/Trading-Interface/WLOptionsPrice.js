import React, { useState } from "react"

export const WLOptionsPrice = (props) => {
  const { symbol, type, strike, date, updates } = props

  const [loading, setLoading] = useState(true)
  const [price, setPrice] = useState(0)
  function nestedLookup(key, obj) {
    let results = []
    for (let prop in obj) {
      if (prop === key) {
        results.push(obj[prop])
      }
      if (typeof obj[prop] === "object") {
        results = results.concat(nestedLookup(key, obj[prop]))
      }
    }
    return results
  }
  const fecthData = React.useCallback(async () => {
    let properDate =
      new Date().getFullYear() +
      "-" +
      date.split("/")[0] +
      "-" +
      date.split("/")[1]
    console.log(properDate)
    let h = fetch(
      `https://api.tdameritrade.com/v1/marketdata/chains?apikey=DPQIIDYODNBWGFCL5S9OVVHSE0GNWMG8&symbol=${symbol}&contractType=${type}&strike=${strike}&fromDate=${properDate}&toDate=${properDate}`
    )
      .then((response) => response.json())
      .then((result) => {
        // console.log(result)
        setPrice(nestedLookup("mark", result)[0])
      })
      .catch((error) => console.log("error", error))
  })

  React.useEffect(() => {
    setLoading(true)
    fecthData()
    console.log("updating")
    setLoading(false)
  }, [updates])
  return <>{loading ? "--" : price}</>
}
