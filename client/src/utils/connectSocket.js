import { io } from "socket.io-client";

export const socket = io("wss://chat-app-socket-test1.glitch.me/", {
  headers: {
    "user-agent": "Mozilla",
  },
});
