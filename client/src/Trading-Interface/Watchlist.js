import React from "react"
import "./Watchlist.css"
import { StockPrice } from "./StockPrice"
import { WLOptionsPrice } from "./WLOptionsPrice"
import dataB from "./watchlist.json"

export const Watchlist = (props) => {
  const { watchListArr, setWatchListArr, handleQuoteFromWatchList } = props

  const [strike, setStrike] = React.useState(0)
  const [updates, setUpdates] = React.useState(true)
  const [live, setLive] = React.useState(false)
  const [intervalVar, setIntveralVar] = React.useState()
  const getOptionPrice = (watchListItem) => {}
  const [inputValue, setInputValue] = React.useState("")

  const handleInputChange = (event) => {
    setInputValue(event.target.value)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    // Do something with the submitted value
    console.log("Submitted value:", inputValue)
    // Reset the input field
    localStorage.setItem("i", inputValue)
    setInputValue("")
  }

  React.useEffect(() => {
    return () => {}
  })

  React.useEffect(() => {
    // console.log(data)
    let data = { watchList: [] }
    let dataLocal = localStorage.getItem("watchListArr")
    console.log(dataLocal)
    if (dataLocal.length > 0) {
      data = JSON.parse(dataLocal)
      console.log(data.watchList)
      console.log(dataB.watchList)
    } else {
      console.log("nothing")
    }
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
            let clickFunc = () => {
              let arr = watchListArr
              arr.splice(key, 1)
              setWatchListArr(arr)
              setUpdates(!updates)
              localStorage.setItem(
                "watchListArr",
                JSON.stringify({ watchList: arr })
              )
              {
                /* watchListArr
              console.log(key) */
              }
            }
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
                <td>
                  <button onClick={clickFunc}>X</button>
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
      {/* <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="Enter something"
        />
        <button type="submit">Set</button>
      </form>
      <button
        onClick={() => {
          console.log(localStorage.getItem("i"))
        }}
      >
        Get
      </button> */}
    </div>
  )
}
