import React, { useState, useEffect } from "react"
import "./Settings.css"

export const Settings = (props) => {
  const { setOpen } = props
  const [selectedMenuItem, setSelectedMenuItem] = useState("General")
  const [boxItems, setBoxItems] = useState({})

  useEffect(() => {
    const storedBoxItems = localStorage.getItem("recentStocks")
    if (storedBoxItems) {
      setBoxItems(JSON.parse(storedBoxItems))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("recentStocks", JSON.stringify(boxItems))
  }, [boxItems])

  const handleMenuClick = (menuItem) => {
    setSelectedMenuItem(menuItem)
  }

  const handleBoxClick = (boxKey) => {
    const updatedBoxItems = { ...boxItems }
    delete updatedBoxItems[boxKey]
    setBoxItems(updatedBoxItems)
  }

  const renderContent = () => {
    switch (selectedMenuItem) {
      case "General":
        return (
          <div className="box-area">
            {Object.entries(boxItems).map(([key, value]) => (
              <div
                key={key}
                className="box"
                onClick={() => handleBoxClick(key)}
              >
                {value}
              </div>
            ))}
          </div>
        )
      case "Appearance":
        return <p>This is the Appearance content.</p>
      case "Notifications":
        return <p>This is the Notifications content.</p>
      default:
        return null
    }
  }

  const handleSave = () => {
    setOpen(false)
    console.log("Save button clicked")
  }

  const handleClose = () => {
    setOpen(false)
    console.log("Close button clicked")
  }

  return (
    <div className="settings">
      <div className={`sidebar`}>
        <ul className="sidebar-menu">
          <li onClick={() => handleMenuClick("General")}>General</li>
          <li onClick={() => handleMenuClick("Appearance")}>Appearance</li>
          <li onClick={() => handleMenuClick("Notifications")}>
            Notifications
          </li>
        </ul>
      </div>
      <div className="content">
        <h2>{selectedMenuItem}</h2>
        <div className="underline"></div>
        {renderContent()}
        <div className="button-container">
          <button className="save-button" onClick={handleSave}>
            Save
          </button>
          <button className="close-button" onClick={handleClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
