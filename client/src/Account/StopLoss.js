import React, { useState } from "react"
import { Button, Dialog } from "@mui/material"
import RefreshIcon from "@mui/icons-material/Refresh"
import { Tabs, Tab, Typography, Box } from "@mui/material"
import "./StopLoss.css"

export const StopLoss = (props) => {
  const { currSymbol, quantity, socket, onClick, averagePrice } = props
  const [open, setOpen] = useState(false)
  const [currentTab, setCurrentTab] = useState(1)
  const [firstTime, setFirstTime] = React.useState(true)
  const [limitPrice, setLimitPrice] = React.useState(0)
  const [stopPrice, setStopPrice] = React.useState(0)
  const [currentPrice, setCurrentPrice] = React.useState(0)
  const [quantityS, setQuantityS] = React.useState(1)

  const [tabBackground, setTabBackground] = useState([
    "black",
    "white",
    "black",
  ])
  const [orders, setOrders] = React.useState([])

  const handleChangeTab = (event, newValue) => {
    setCurrentTab(newValue)
    const updatedBackground = tabBackground.map((color, index) =>
      index === newValue ? "white" : "black"
    )
    setTabBackground(updatedBackground)
  }

  const handleClickOpen = () => {
    setOpen(true)
    onClick()
  }

  const handleClose = () => {
    setOpen(false)
  }

  const refreshPrice = () => {
    console.log(currSymbol)
    let arr = currSymbol.match(/[a-zA-Z]+|[0-9]+/gm)
    console.log(arr)
    let symbol = arr[0] === "SPXW" ? "$SPX.X" : arr[0],
      date = arr[1].substring(0, 2) + "/" + arr[1].substring(2, 4),
      type = arr[2],
      strike = arr[3]
    socket.emit("getOptionsPriceUpdate", symbol, date, type, strike)
  }

  React.useEffect(() => {
    // console.log(rows)
    let handle = 0

    const getOrders = (orders) => {
      let tempRows = []
      console.log(orders)
      orders.forEach((order, index) => {
        tempRows.push({
          id: order.orderId,
          description: order.orderLegCollection[0].instrument.description,
          price: order.price,
          quantity: order.quantity,
          remainingQuantity: order.remainingQuantity,
          stopPrice: order.stopPrice,
        })
      })

      console.log(tempRows)
      setOrders(tempRows)
      // setRows(tempRows)
      // setPositions(JSON.parse(pos)[0]["securitiesAccount"]["positions"])
    }
    const optionsPriceUpdate = (message) => {
      setCurrentPrice(message)
    }
    socket.on("stopOrders", getOrders)
    socket.on("liveOptionsUpdate", optionsPriceUpdate)

    // socket.on("cancelOrderStatus", handleOrderUpdate)
    if (firstTime) {
      socket.emit("getOrdersForStop", currSymbol)
      let arr = currSymbol.match(/[a-zA-Z]+|[0-9]+/gm)
      console.log(arr)
      let symbol = arr[0] === "SPXW" ? "$SPX.X" : arr[0],
        date = arr[1].substring(0, 2) + "/" + arr[1].substring(2, 4),
        type = arr[2],
        strike = arr[3]
      socket.emit("getOptionsPriceUpdate", symbol, date, type, strike)
      setFirstTime(false)
    }
    if (open) {
      handle = setInterval(() => {
        let arr = currSymbol.match(/[a-zA-Z]+|[0-9]+/gm)
        console.log(arr)
        let symbol = arr[0] === "SPXW" ? "$SPX.X" : arr[0],
          date = arr[1].substring(0, 2) + "/" + arr[1].substring(2, 4),
          type = arr[2],
          strike = arr[3]
        socket.emit("getOptionsPriceUpdate", symbol, date, type, strike)
      }, 2000)
    }
    return () => {
      // socket.off("cancelOrderStatus", handleOrderUpdate)
      socket.off("stopOrders", getOrders)
      socket.off("liveOptionsUpdate", optionsPriceUpdate)
      clearInterval(handle)
    }
  })

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Stop
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="xs"
        className="dialog"
      >
        <div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h2>
              Stop Loss
              <Button
                style={{ display: "flex", color: "white" }}
                onClick={refreshPrice}
              >
                <RefreshIcon></RefreshIcon>
              </Button>
            </h2>
            {/* <div onClick={refreshPrice}>Refresh</div> */}
          </div>
          {/* TABS */}
          <div className="tabs">
            <Tabs
              value={currentTab}
              onChange={handleChangeTab}
              centered
              sx={{
                minHeight: "20px",
                "& .MuiTabs-indicator": {
                  display: "none",
                },
              }}
            >
              <Tab
                label="Stop Limit"
                disableRipple
                sx={{
                  flexGrow: 1,
                  borderRadius: "4px",
                  backgroundColor: tabBackground[0],
                  color: currentTab === 0 ? "white" : "#a1a1a1",
                  transition: "background-color 0.3s",
                  minHeight: "20px", // Set the desired height
                  textTransform: "none", // Make the text lowercase
                  padding: "0px",
                  maxWidth: "137px",
                }}
              />
              <Tab
                label="Stop Market"
                disableRipple
                sx={{
                  flexGrow: 1,
                  borderRadius: "4px",
                  backgroundColor: tabBackground[1],
                  color: currentTab === 1 ? "white" : "#a1a1a1",
                  transition: "background-color 0.3s",
                  minHeight: "20px",
                  textTransform: "none",
                  padding: "0px",
                  maxWidth: "137px",
                }}
              />

              <Tab
                label="Trailing Stop"
                disableRipple
                sx={{
                  flexGrow: 1,
                  borderRadius: "4px",
                  backgroundColor: tabBackground[2],
                  color: currentTab === 2 ? "white" : "#a1a1a1",
                  transition: "background-color 0.3s",
                  minHeight: "20px",
                  textTransform: "none",
                  padding: "0px",
                  maxWidth: "137px",
                }}
              />
            </Tabs>
          </div>
          {/* STOP LIMIT */}
          <TabPanel value={currentTab} index={0}>
            <div className="dialog-content">
              <div className="editable-fields">
                <div className="dialog-form">
                  <label className="label-dialog">Symbol: </label>
                  <label
                    readOnly
                    className="input"
                    type="text"
                    contentEditable={false}
                  >
                    {currSymbol !== ""
                      ? ((sym) => {
                          let arr = sym.match(/[a-zA-Z]+|[0-9]+/gm)
                          let symbol = arr[0],
                            date =
                              arr[1].substring(0, 2) +
                              "/" +
                              arr[1].substring(2, 4),
                            type = arr[2],
                            strike = arr[3]
                          return (
                            symbol + "  " + date + "  " + type + "  $" + strike
                          )
                        })(currSymbol)
                      : ""}
                  </label>
                </div>
              </div>
              <div className="editable-fields" style={{ marginTop: "2px" }}>
                <div className="dialog-form ef-50">
                  <label className="label-dialog">Average Price:</label>
                  <label
                    readOnly
                    className="input-1"
                    type="text"
                    contentEditable={false}
                    onClick={() => {
                      setLimitPrice(
                        currSymbol.substring(0, 4) === "SPXW"
                          ? Math.floor(averagePrice[0] * 10) / 10
                          : averagePrice[0]
                      )
                    }}
                    sx={{ cursor: "pointer" }}
                    style={{ cursor: "pointer" }}
                  >
                    {averagePrice}
                  </label>
                </div>
                <div className="dialog-form ef-50">
                  <label className="label-dialog">Current Price:</label>
                  <label
                    readOnly
                    className="input-1"
                    type="text"
                    contentEditable={false}
                    onClick={() => {
                      setLimitPrice(
                        currSymbol.substring(0, 4) === "SPXW"
                          ? Math.floor(currentPrice[0] * 10) / 10
                          : currentPrice[0]
                      )
                    }}
                    sx={{ cursor: "pointer" }}
                    style={{ cursor: "pointer" }}
                  >
                    {currentPrice.toString().split(",")[0]}
                  </label>
                </div>
              </div>
              <div className="editable-fields">
                <div className="dialog-form ef-50" style={{ width: "47%" }}>
                  <label className="label-dialog">Limit Price: </label>
                  <input
                    className="input"
                    id="name"
                    type="text"
                    value={limitPrice}
                    onChange={(e) => {
                      setLimitPrice(e.target.value)
                    }}
                  />
                </div>
                <div className="dialog-form ef-50">
                  <label className="label-dialog">Quantity:</label>
                  <input
                    className="input"
                    id="name"
                    type="number"
                    value={quantityS}
                    onChange={(e) => {
                      console.log(e.target.value)
                      let setValue =
                        e.target.value <= quantity && e.target.value > 0
                          ? e.target.value
                          : maxQuantity
                      setQuantityS(setValue)
                    }}
                  />
                </div>
              </div>
              <div className="editable-fields">
                <div className="dialog-form ef-50" style={{ width: "46%" }}>
                  <label className="label-dialog">Stop Price:</label>
                  <input
                    className="input"
                    id="name"
                    type="text"
                    value={stopPrice}
                    onChange={(e) => {
                      setStopPrice(e.target.value)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="bottom-dialog">
              <button
                onClick={() => {
                  setOpen(false)
                }}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  socket.emit(
                    "placeStopLimitOrder",
                    currSymbol,
                    quantityS,
                    stopPrice,
                    limitPrice
                  )
                  socket.emit("getOrdersForStop", currSymbol)
                  socket.emit("getOrders")
                  setOpen(false)
                }}
                className="send-button"
              >
                Send
              </button>
            </div>
          </TabPanel>
          {/* STOP MARKET */}
          <TabPanel value={currentTab} index={1}>
            <div className="dialog-content">
              <div className="editable-fields">
                <div className="dialog-form">
                  <label className="label-dialog">Symbol: </label>
                  <label
                    readOnly
                    className="input"
                    type="text"
                    contentEditable={false}
                  >
                    {currSymbol !== ""
                      ? ((sym) => {
                          let arr = sym.match(/[a-zA-Z]+|[0-9]+/gm)
                          let symbol = arr[0],
                            date =
                              arr[1].substring(0, 2) +
                              "/" +
                              arr[1].substring(2, 4),
                            type = arr[2],
                            strike = arr[3]
                          return (
                            symbol + "  " + date + "  " + type + "  $" + strike
                          )
                        })(currSymbol)
                      : ""}
                  </label>
                </div>
              </div>
              <div className="editable-fields" style={{ marginTop: "2px" }}>
                <div className="dialog-form ef-50">
                  <label className="label-dialog">Average Price:</label>
                  <label
                    readOnly
                    className="input-1"
                    type="text"
                    contentEditable={false}
                    onClick={() => {
                      setStopPrice(
                        currSymbol.substring(0, 4) === "SPXW"
                          ? Math.floor(averagePrice * 10) / 10
                          : averagePrice
                      )
                    }}
                    sx={{ cursor: "pointer" }}
                    style={{ cursor: "pointer" }}
                  >
                    {averagePrice}
                  </label>
                </div>
                <div className="dialog-form ef-50">
                  <label className="label-dialog">Current Price:</label>
                  <label
                    readOnly
                    className="input-1"
                    type="text"
                    contentEditable={false}
                    onClick={() => {
                      setStopPrice(
                        currSymbol.substring(0, 4) === "SPXW"
                          ? Math.floor(currentPrice[0] * 10) / 10
                          : currentPrice[0]
                      )
                    }}
                    sx={{ cursor: "pointer" }}
                    style={{ cursor: "pointer" }}
                  >
                    {currentPrice.toString().split(",")[0]}
                  </label>
                </div>
              </div>
              <div className="editable-fields">
                <div className="dialog-form ef-50">
                  <label className="label-dialog">Stop Price:</label>
                  <input
                    className="input"
                    id="name"
                    type="text"
                    value={stopPrice}
                    onChange={(e) => {
                      setStopPrice(e.target.value)
                    }}
                  />
                </div>
                <div className="dialog-form ef-50">
                  <label className="label-dialog">Quantity:</label>
                  <input
                    className="input"
                    id="name"
                    type="number"
                    value={quantityS}
                    onChange={(e) => {
                      console.log(e.target.value)
                      let setValue =
                        e.target.value <= quantity && quantity > 0
                          ? e.target.value
                          : maxQuantity
                      setQuantityS(setValue)
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="bottom-dialog">
              <button
                onClick={() => {
                  setOpen(false)
                }}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  socket.emit(
                    "placeStopMarketOrder",
                    currSymbol,
                    quantityS,
                    stopPrice
                  )
                  socket.emit("getOrdersForStop", currSymbol)
                  socket.emit("getOrders")
                  setOpen(false)
                }}
                className="send-button"
              >
                Send
              </button>
            </div>
          </TabPanel>
          <TabPanel value={currentTab} index={2}>
            <Typography variant="h5">IN PROGRESS</Typography>
            <Typography>AMAZING</Typography>
          </TabPanel>
          {/* All Stop Loss Orders  */}
          {orders.length > 0 ? (
            <div className="table-container">
              <table className="orders-table">
                <thead>
                  <tr>
                    <td style={{ width: "150px" }}>Symbol</td>
                    <td>Limit</td>
                    <td>Stop</td>
                    <td>Quantity</td>
                    <td className="cancel_row"></td>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={index}>
                      <td style={{ width: "150px" }}>{order.description}</td>
                      <td>{order.price}</td>
                      <td>{order.stopPrice}</td>
                      <td>
                        {order.quantity -
                          order.remainingQuantity +
                          "/" +
                          order.quantity}
                      </td>
                      <td className="cancel_row">
                        <button
                          onClick={() => {
                            socket.emit("cancelOrders", order.id)
                            orders.splice(index, 1)
                          }}
                        >
                          X
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <></>
          )}
        </div>
      </Dialog>
    </div>
  )
}

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ padding: "5px" }}>{children}</Box>}
    </div>
  )
}
