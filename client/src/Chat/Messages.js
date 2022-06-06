import React from "react"
import Linkify from "react-linkify"
import "./Messages.css"

export const MessageLeft = (props) => {
  const message = props.message ? props.message : "no message"
  //   const timestamp = props.timestamp ? props.timestamp : "";
  //   const displayName = props.displayName ? props.displayName : "名無しさん";
  return (
    <>
      <div className="messageRow">
        <div>
          {/* <div className={classes.displayName}>{displayName}</div> */}
          <div className="messageBlue">
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
            {/* <div className={classes.messageTimeStampRight}>{timestamp}</div> */}
          </div>
        </div>
      </div>
    </>
  )
}