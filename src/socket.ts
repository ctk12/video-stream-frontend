import { io } from "socket.io-client";

const URL = "https://video-stream-backend.vercel.app";

export const socket = io(URL);