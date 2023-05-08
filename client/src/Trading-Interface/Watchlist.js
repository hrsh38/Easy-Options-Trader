import React from "react"
import "./Watchlist.css"
import { StockPrice } from "./StockPrice"
import { WLOptionsPrice } from "./WLOptionsPrice"
import data from "./watchlist.json"

export const Watchlist = (props) => {
  const { watchListArr, setWatchListArr, handleQuoteFromWatchList } = props

  const [strike, setStrike] = React.useState(0)
  const [updates, setUpdates] = React.useState(true)
  const [live, setLive] = React.useState(false)
  const [intervalVar, setIntveralVar] = React.useState()
  const getOptionPrice = (watchListItem) => {}

  React.useEffect(() => {
    return () => {}
  })

  React.useEffect(() => {
    // console.log(data)
    setWatchListArr(data.watchList)
    if (live) {
      const interval = setInterval(() => {
        setUpdates(!updates)
      }, 3000)
      setIntveralVar(interval)
    }
    return () => clearInterval(intervalVar) // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  }, [live, updates])

  return (
    <div>
      <h2 className="watchlist-header">Watch List</h2>
      <table className="watchlist">
        <tbody>
          <tr className="watchlist-item">
            <th>Option</th>
            <th>OP</th>
            <th>SP</th>
          </tr>
          {watchListArr.map((watchlistItem, key) => {
            return (
              <tr className="watchlist-item" key={key}>
                <td
                  className="clickable-item"
                  onClick={() => {
                    console.log("click")
                    handleQuoteFromWatchList(watchlistItem)
                  }}
                >
                  {watchlistItem[0] +
                    " " +
                    watchlistItem[1] +
                    " $" +
                    watchlistItem[3] +
                    watchlistItem[2]}
                </td>
                <td>
                  <WLOptionsPrice
                    symbol={watchlistItem[0]}
                    type={watchlistItem[2] === "P" ? "PUT" : "CALL"}
                    strike={watchlistItem[3]}
                    date={watchlistItem[1]}
                    updates={updates}
                  />
                </td>
                <td>
                  <StockPrice symbol={watchlistItem[0]} updates={updates} />
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="watchlist-footer">
        <div
          onClick={() => {
            setUpdates(!updates)
          }}
        >
          Refresh
        </div>
        <div style={{ alignItems: "center", display: "flex" }}>
          Live:{"  "}
          <label className="switch">
            <input
              type="checkbox"
              checked={live}
              onChange={(e) => {
                setLive(!live)
                if (live) {
                  clearInterval(intervalVar)
                }
              }}
            />
            <span className="slider round"></span>
          </label>
        </div>
      </div>
    </div>
  )
}
