import React from "react"

export const AccountInfo = (props) => {
  const { socket } = props

  React.useEffect(() => {
    return () => {} // This represents the unmount function, in which you need to clear your interval to prevent memory leaks.
  })
  return (
    <>
      <div>{}</div>
    </>
  )
}
