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

export const Positions = (props) => {
  const { socket } = props
  const [positions, setPositions] = React.useState({})
  const [open, setOpen] = React.useState(false)
  const [currIndex, setcurrIndex] = React.useState(-1)
  const [currSymbol, setCurrSymbol] = React.useState("")
  const [currAveragePrice, setCurrAveragePrice] = React.useState(0)
  const [quantity, setQuantity] = React.useState(0)
  const [maxQuantity, setMaxQuantity] = React.useState(0)
  const [askPrice, setAskPrice] = React.useState(0)
  const [columns, setColumns] = React.useState([
    { field: "id", headerName: "ID", width: 50 },
    { field: "ticker", headerName: "Ticker", width: 90 },
    {
      field: "type",
      headerName: "Type",
      width: 90,
      editable: true,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      width: 90,
      editable: true,
    },
    {
      field: "value",
      headerName: "Value",
      // type: "number",
      // width: 110,
      editable: true,
    },
    {
      field: "profitLoss",
      headerName: "P/L(%)",
      description: "This column has a value getter and is not sortable.",
      width: 90,
    },
    {
      field: "close",
      headerName: "",
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
          console.log(positions)
          e.stopPropagation() // don't select this row after clicking
        }

        return (
          <Button
            onClick={onClick}
            style={{ backgroundColor: "red", color: "white" }}
          >
            X
          </Button>
        )
      },
    },
  ])
  const [rows, setRows] = React.useState([])
  const [firstTime, setFirstTime] = React.useState(true)

  const handleClose = React.useCallback((e) => {
    setOpen(false)
  })
  const send = React.useCallback((e) => {
    e.preventDefault()
    setOpen(false)
    socket.emit("sellPosition", currSymbol, quantity, currAveragePrice)
  })

  React.useEffect(() => {
    const getPositions = (pos) => {
      setPositions(JSON.parse(pos)[0]["securitiesAccount"]["positions"])
      let tempRows = []
      JSON.parse(pos)[0]["securitiesAccount"]["positions"].forEach(
        (posData, index) => {
          tempRows.push({
            id: index,
            ticker: posData.instrument.underlyingSymbol,
            type: posData.instrument.putCall,
            quantity: posData.longQuantity,
            value: "$" + posData.marketValue,
            profitLoss: posData.currentDayProfitLossPercentage + "%",
            close: posData,
            symbol: posData.instrument.symbol,
            averagePrice: posData.averagePrice,
          })
        }
      )
      setRows(tempRows)
    }
    socket.on("positions", getPositions)
    setFirstTime(false)

    if (firstTime) {
      socket.emit("getPositions")
    }
    return () => {
      socket.off("positions", getPositions)
    }
  })
  return (
    <div id="dialog" style={{ position: "relative" }}>
      <Dialog open={open} onClose={handleClose} fullWidth={true}>
        <DialogTitle>Close Position</DialogTitle>
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
              value={""}
              contentEditable={false}
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
            <TextField autoFocus id="name" type="text" />
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
            />
          </div>
          {/* <List
            sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
          >
            <ListItem className={"list_item"}>
              <div>{"Ticker"}</div>
              <div>{"Type"}</div>
              <div>{"Quantity"}</div>
              <div>{"Value"}</div>
              <div>{"P/L(%)"}</div>
            </ListItem>
            {positions.map((posData, index) => (
              <ListItem key={index} className={"list_item"}>
                <ListItemText primary={posData.instrument.underlyingSymbol} />
                <ListItemText primary={posData.instrument.putCall} />
                <ListItemText primary={posData.quantity} />
                <ListItemText primary={"$" + posData.marketValue} />
                <ListItemText primary={posData.currentDayProfitLoss + "%"} />
                <Button style={{ backgroundColor: "red", color: "white" }}>
                  X
                </Button>
              </ListItem>
            ))}
          </List> */}
        </>
      ) : (
        <> No positions</>
      )}
    </div>
  )
}
