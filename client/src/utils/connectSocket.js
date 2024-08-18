import { io } from "socket.io-client";

export const socket = io("https://server-kappa-self.vercel.app/", {
  withCredentials: true,
});
