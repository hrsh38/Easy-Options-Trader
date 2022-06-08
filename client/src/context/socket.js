import socketio from "socket.io-client"
export const SOCKET_URL = "http://127.0.0.1:5000/"
import { createContext } from "react"

export const socket = socketio(SOCKET_URL)
export const SocketContext = createContext()
