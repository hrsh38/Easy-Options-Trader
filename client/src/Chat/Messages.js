import React from "react"
import Linkify from "react-linkify"
import "./Messages.css"

export const MessageLeft = (props) => {
  const { messageParse } = props
  const message = props.message ? props.message : "no message"
  //   const timestamp = props.timestamp ? props.timestamp : "";
  //   const displayName = props.displayName ? props.displayName : "名無しさん";
  return (
    <>
      <div className="messageRow">
        <div
          className="messageBlue"
          onClick={() => {
            messageParse(message)
          }}
        >
          <div>
            <p className="messageContent">
              <Linkify
                className="messageContent"
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <a target="blank" href={decoratedHref} key={key}>
                    {decoratedText}
                  </a>
                )}
              >
                {message}
              </Linkify>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
