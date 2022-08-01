import React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import "./Positions.css"
import { Button } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { OptionsPrice } from "./OptionsPrice"

export const Positions = (props) => {
  const {
    socket,
    symbol,
    date,
    type,
    strike,
    setSymbol,
    setDate,
    setType,
    setStrike,
  } = props
  const interval = React.useRef(null)
  const [liveOptionsPrice, setLiveOptionsPrice] = React.useState("")
  const [positions, setPositions] = React.useState({})
  const [open, setOpen] = React.useState(false)
  const [currIndex, setcurrIndex] = React.useState(-1)
  const [currSymbol, setCurrSymbol] = React.useState("")
  const [currAveragePrice, setCurrAveragePrice] = React.useState(0)
  const [quantity, setQuantity] = React.useState(0)
  const [maxQuantity, setMaxQuantity] = React.useState(0)
  const [askPrice, setAskPrice] = React.useState(0)
  const [symbolArr] = React.useState(null)
  const [columns, setColumns] = React.useState([
    // { field: "id", headerName: "ID", width: 50 },
    {
      field: "date",
      headerName: "Date",
      width: 90,
      editable: false,
      sortable: false,
    },
    {
      field: "ticker",
      headerName: "Ticker",
      width: 90,
      editable: false,
      sortable: false,
    },
    {
      field: "type",
      headerName: "Type",
      width: 90,
      editable: false,
      sortable: false,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 90,
      editable: false,
      sortable: false,
    },
    {
      field: "value",
      headerName: "Value",
      // type: "number",
      // width: 110,
      editable: false,
      sortable: false,
    },
    {
      field: "profitLoss",
      headerName: "P/L(%)",
      width: 90,
      editable: false,
    },
    {
      field: "averagePrice",
      headerName: "Initial",
      width: 90,
      editable: false,
      sortable: false,
    },
    {
      field: "currentPrice",
      headerName: "Current",
      width: 90,
      editable: false,
      sortable: false,
    },
    {
      field: "profitLossUSD",
      headerName: "P/L($)",
      width: 110,
      editable: false,
      sortable: false,
    },
    {
      field: "close",
      headerName: "Close",
      editable: false,
      width: 82,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          console.log(params)
          setOpen(true)
          setCurrAveragePrice(params.row.averagePrice)
          setCurrSymbol(params.row.symbol)
          setcurrIndex(params.id)
          setQuantity(params.row.quantity)
          setMaxQuantity(params.row.quantity)
          let arr = params.row.symbol.match(/[a-zA-Z]+|[0-9]+/gm)
          let symbol = arr[0],
            date = arr[1].substring(0, 2) + "/" + arr[1].substring(2, 4),
            type = arr[2],
            strike = arr[3]
          socket.emit("getOptionsPriceUpdate", symbol, date, type, strike)
          e.stopPropagation() // don't select this row after clicking
        }

        return (
          <Button
            onClick={onClick}
            style={{ backgroundColor: "red", color: "white", width: "50px" }}
          >
            CLOSE
          </Button>
        )
      },
    },
    {
      field: "stopLoss",
      headerName: "Stop Loss",
      editable: false,
      width: 82,
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          e.stopPropagation() // don't select this row after clicking
        }

        return (
          <Button
            onClick={onClick}
            style={{ backgroundColor: "red", color: "white", width: "50px" }}
          >
            Limit
          </Button>
        )
      },
    },
  ])
  const [rows, setRows] = React.useState([])
  const [firstTime, setFirstTime] = React.useState(true)

  const handleClose = React.useCallback((e) => {
    setOpen(false)
    clearInterval(interval.current)
  })

  const send = React.useCallback((e) => {
    e.preventDefault()
    setOpen(false)
    socket.emit("sellPosition", currSymbol, quantity, askPrice)
    socket.emit("getOrders")
  })

  const refreshPrice = React.useCallback((e) => {
    let arr = currSymbol.match(/[a-zA-Z]+|[0-9]+/gm)
    console.log(arr)
    let symbol = arr[0],
      date = arr[1].substring(0, 2) + "/" + arr[1].substring(2, 4),
      type = arr[2],
      strike = arr[3]
    socket.emit("getOptionsPriceUpdate", symbol, date, type, strike)
  })

  React.useEffect(() => {
    let handle = 0

    const getPositions = (pos) => {
      setPositions(JSON.parse(pos)[0]["securitiesAccount"]["positions"])
      let tempRows = []
      JSON.parse(pos)[0]["securitiesAccount"]["positions"].forEach(
        (posData, index) => {
          // console.log(posData)
          tempRows.push({
            id: index,
            date:
              posData.instrument.symbol.split("_")[1].substring(0, 2) +
              "/" +
              posData.instrument.symbol.split("_")[1].substring(2, 4),
            ticker: posData.instrument.underlyingSymbol,
            type:
              "$" +
              posData.instrument.description.split(" ")[4] +
              " " +
              posData.instrument.putCall.substring(0, 1),
            quantity: posData.longQuantity,
            value: "$" + posData.marketValue,
            profitLoss: posData.currentDayProfitLossPercentage + "%",
            close: posData,
            symbol: posData.instrument.symbol,
            averagePrice: parseFloat(posData.averagePrice).toFixed(3),
            currentPrice: parseFloat(
              posData.marketValue / (100 * posData.longQuantity)
            ).toFixed(3),
            profitLossUSD:
              "$" +
              (
                (posData.longQuantity *
                  parseFloat(
                    posData.marketValue / (100 * posData.longQuantity)
                  ).toFixed(3) -
                  posData.longQuantity *
                    parseFloat(posData.averagePrice.toFixed(3))) *
                100
              ).toFixed(2),
          })
        }
      )
      setRows(tempRows)
    }
    const optionsPriceUpdate = (message) => {
      setLiveOptionsPrice(message)
    }
    socket.on("positions", getPositions)
    socket.on("liveOptionsUpdate", optionsPriceUpdate)
    if (open) {
      handle = setInterval(() => {
        let arr = currSymbol.match(/[a-zA-Z]+|[0-9]+/gm)
        console.log(arr)
        let symbol = arr[0],
          date = arr[1].substring(0, 2) + "/" + arr[1].substring(2, 4),
          type = arr[2],
          strike = arr[3]
        socket.emit("getOptionsPriceUpdate", symbol, date, type, strike)
      }, 3000)
    }
    setFirstTime(false)
    if (firstTime) {
      socket.emit("getPositions")
    }
    const interval = setInterval(() => {
      socket.emit("getPositions")
    }, 5000)
    return () => {
      socket.off("positions", getPositions)
      socket.off("liveOptionsUpdate", optionsPriceUpdate)
      clearInterval(handle)
      clearInterval(interval)
    }
  })

  return (
    <div id="dialog" style={{ position: "relative" }}>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <DialogTitle>Close Position</DialogTitle>
          <div onClick={refreshPrice}>Refresh</div>
        </div>
        <div className="dialog-content">
          <div className="dialog-form">
            <DialogContentText>Symbol</DialogContentText>
            <TextField
              autoFocus
              id="symbol"
              type="text"
              value={currSymbol}
              contentEditable={false}
            />
          </div>
          <div className="dialog-form">
            <DialogContentText>Average Price</DialogContentText>
            <TextField
              autoFocus
              id="avgPrice"
              type="text"
              value={currAveragePrice}
              contentEditable={false}
            />
          </div>
          <div className="dialog-form">
            <DialogContentText>Average Price</DialogContentText>
            <TextField
              autoFocus
              id="currPrice"
              type="text"
              value={liveOptionsPrice}
              contentEditable={false}
              onClick={() => {
                setAskPrice(liveOptionsPrice)
              }}
              sx={{ cursor: "pointer" }}
              style={{ cursor: "pointer" }}
            />
          </div>
          <div className="dialog-form">
            <DialogContentText>Quantity</DialogContentText>
            <TextField
              autoFocus
              id="name"
              type="number"
              value={quantity}
              onChange={(e) => {
                console.log(e.target.value)
                let setValue =
                  e.target.value <= maxQuantity ? e.target.value : maxQuantity
                setQuantity(setValue)
              }}
            />
          </div>
          <div className="dialog-form">
            <DialogContentText>Ask Price</DialogContentText>
            <TextField
              autoFocus
              id="name"
              type="text"
              value={askPrice}
              onChange={(e) => {
                setAskPrice(e.target.value)
              }}
            />
          </div>
        </div>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={send}>Send</Button>
        </DialogActions>
      </Dialog>
      {rows.length > 0 ? (
        <>
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[3]}
              // checkboxSelection
              disableSelectionOnClick
              autoPageSize={true}
              autoHeight
              hideFooter
              sx={{
                bgcolor: "black",
                height: "-webkit-fill-available",
                color: "white",
              }}
            />
          </div>
          <Button
            onClick={() => {
              socket.emit("getPositions")
            }}
          >
            Refresh
          </Button>
        </>
      ) : (
        <> No positions</>
      )}
    </div>
  )
}
