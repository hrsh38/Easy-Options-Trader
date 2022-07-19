import React from "react"
import Typography from "@mui/material/Typography"

export const AccountInfo = (props) => {
  const { socket } = props
  const [account, setAccount] = React.useState([])
  const [firstTime, setFirstTime] = React.useState(true)

  React.useEffect(() => {
    const getAccountInfo = (account) => {
      // console.log(account)
      setAccount(account)
      console.log(account)
    }
    socket.on("accountInfo", getAccountInfo)

    if (firstTime) {
      socket.emit("getAccountInfo")
      setFirstTime(false)
    }
    const interval = setInterval(() => {
      console.log("account-refresh")
      socket.emit("getAccountInfo")
    }, 30000)
    return () => {
      socket.off("accountInfo", getAccountInfo)
      clearInterval(interval)
    }
  })
  return (
    <>
      <Typography variant="h5" component="div" style={{ marginBottom: "30px" }}>
        Account Info
      </Typography>
      {account.length > 0 ? (
        <>
          <div>
            <Typography sx={{ mb: 1.5 }} color="white">
              {"Total Value: "}
              {account[0].securitiesAccount.currentBalances.liquidationValue.toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                }
              )}
            </Typography>
          </div>
          <div>
            <Typography sx={{ mb: 1.5 }} color="white">
              {"Available Balance: "}{" "}
              {(
                account[0].securitiesAccount.currentBalances.cashBalance -
                account[0].securitiesAccount.currentBalances.unsettledCash
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </div>
          <div>
            <Typography sx={{ mb: 1.5 }} color="white">
              {"Unsettled Cash: "}{" "}
              {account[0].securitiesAccount.currentBalances.unsettledCash.toLocaleString(
                "en-US",
                {
                  style: "currency",
                  currency: "USD",
                }
              )}
            </Typography>
          </div>
          <div>
            <Typography sx={{ mb: 1.5 }} color="white">
              {"P/L: "}
              {(
                account[0].securitiesAccount.currentBalances.liquidationValue -
                account[0].securitiesAccount.initialBalances.accountValue
              ).toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
              })}
            </Typography>
          </div>
        </>
      ) : (
        <>Loading..</>
      )}
    </>
  )
}
