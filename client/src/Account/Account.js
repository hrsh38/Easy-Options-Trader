import * as React from "react"
import PropTypes from "prop-types"
import SwipeableViews from "react-swipeable-views"
import { useTheme } from "@mui/material/styles"
import AppBar from "@mui/material/AppBar"
import Tabs from "@mui/material/Tabs"
import Tab from "@mui/material/Tab"
import Typography from "@mui/material/Typography"
import Box from "@mui/material/Box"
import { Positions } from "./Positions"
import { Orders } from "./Orders"
import { AccountInfo } from "./AccountInfo"
import "./Account.css"

const axios = require("axios").default

function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography component={"span"} variant={"body2"}>
            {children}
          </Typography>
        </Box>
      )}
    </div>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
}

function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  }
}

export const Account = (props) => {
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
  const theme = useTheme()
  const [value, setValue] = React.useState(0)
  const [firstTime, setFirstTime] = React.useState(true)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  const handleChangeIndex = (index) => {
    setValue(index)
  }

  React.useEffect(() => {
    if (firstTime) {
      socket.emit("getOrders")

      setFirstTime(false)
    }

    return () => {}
  }, [])

  return (
    <Box
      sx={{
        bgcolor: "black",
        height: "-webkit-fill-available",
        color: "white",
      }}
    >
      <AppBar position="static">
        <Tabs
          value={value}
          sx={{ bgcolor: "#393939" }}
          onChange={handleChange}
          indicatorColor="primary"
          textColor="inherit"
          variant="fullWidth"
          aria-label=""
          visibleScrollbar
        >
          <Tab label="Account Info" {...a11yProps(0)} />
          <Tab label="Positions" {...a11yProps(1)} />
          <Tab label="Orders" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <SwipeableViews
        axis={theme.direction === "rtl" ? "x-reverse" : "x"}
        index={value}
        onChangeIndex={handleChangeIndex}
      >
        <TabPanel value={value} index={0} dir={theme.direction}>
          <AccountInfo socket={socket} />
        </TabPanel>
        <TabPanel value={value} index={1} dir={theme.direction}>
          <Positions
            socket={socket}
            symbol={symbol}
            date={date}
            type={type}
            strike={strike}
            setSymbol={setSymbol}
            setDate={setDate}
            setType={setType}
            setStrike={setStrike}
          />
        </TabPanel>
        <TabPanel value={value} index={2} dir={theme.direction}>
          <Orders socket={socket} />
        </TabPanel>
      </SwipeableViews>
    </Box>
  )
}
