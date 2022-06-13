import React from "react"
import List from "@mui/material/List"
import ListItem from "@mui/material/ListItem"
import ListItemText from "@mui/material/ListItemText"
import IconButton from "@mui/material/IconButton"
import { Button } from "@mui/material"
import { DataGrid } from "@mui/x-data-grid"

export const Orders = (props) => {
  const { socket } = props
  const [rows, setRows] = React.useState([])
  const [firstTime, setFirstTime] = React.useState(true)
  const [cancelOrderStatus, setCancelOrderStatus] = React.useState("")
  const [currIndex, setCurrIndex] = React.useState(-1)
  const [update, setUpdate] = React.useState(true)
  const [orders, setOrders] = React.useState([])

  const [columns, setColumns] = React.useState([
    { field: "id", headerName: "ID", width: 130 },
    { field: "description", headerName: "Description", width: 240 },
    {
      field: "price",
      headerName: "Price",
      width: 30,
      // editable: true,
    },
    {
      field: "quantity",
      headerName: "Q",
      width: 30,
      // editable: true,
    },
    {
      field: "remainingQuantity",
      headerName: "RQ",
      // type: "number",
      width: 30,
      // editable: true,
    },
    {
      field: "status",
      headerName: "Status",
      description: "This column has a value getter and is not sortable.",
      // width: 90,
    },
    // {
    //   field: "type",
    //   headerName: "Type",
    //   // width: 90,
    //   // editable: true,
    // },
    {
      field: "close",
      headerName: "",
      sortable: false,
      renderCell: (params) => {
        const onClick = (e) => {
          console.log(params)
          e.stopPropagation() // don't select this row after clicking
          socket.emit("cancelOrders", params.value)
          setCurrIndex(params.index)
        }

        return (
          <>
            {params.row.status === "WORKING" ||
            params.row.status === "PENDING_ACTIVATION" ? (
              <Button
                onClick={onClick}
                style={{ backgroundColor: "red", color: "white" }}
              >
                X
              </Button>
            ) : (
              <></>
            )}
          </>
        )
      },
    },
  ])

  const handleOrderUpdate = React.useCallback(
    (e) => {
      socket.emit("getOrders")
      console.log(e)
      if (e.indexOf("20")) {
        let tempRows = rows
        setRows(tempRows)
        setUpdate(!update)
      }
    },
    [update]
  )

  React.useEffect(() => {
    // console.log(rows)

    const getOrders = (orders) => {
      let tempRows = []
      setOrders(orders)
      console.log(orders)
      orders.forEach((order, index) => {
        tempRows.push({
          id: order.orderId,
          description: order.orderLegCollection[0].instrument.description,
          price: order.price,
          quantity: order.quantity,
          remainingQuantity: order.remainingQuantity,
          status: order.status,
          close: order.orderId,
        })
      })
      setRows(tempRows)
      // setPositions(JSON.parse(pos)[0]["securitiesAccount"]["positions"])
    }
    socket.on("allOrders", getOrders)

    socket.on("cancelOrderStatus", handleOrderUpdate)
    if (firstTime) {
      socket.emit("getOrders")
      setFirstTime(false)
    }

    return () => {
      socket.off("cancelOrderStatus", handleOrderUpdate)
      socket.off("allOrders", getOrders)
    }
  }, [socket])

  return (
    <>
      {rows.length > 0 ? (
        <>
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={6}
              rowsPerPageOptions={[6]}
              // checkboxSelection
              disableSelectionOnClick
              autoPageSize={true}
              autoHeight
              hideFooter
            />
          </div>
        </>
      ) : (
        <>No Orders</>
      )}
    </>
  )
}
