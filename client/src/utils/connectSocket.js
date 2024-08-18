import { io } from "socket.io-client";

// export const socket = io("https://server-kappa-self.vercel.app", {
//   withCredentials: true,
// });
export const socket = io("http://localhost:5000", {
  withCredentials: true,
});
