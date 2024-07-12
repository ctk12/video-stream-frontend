import { io } from "socket.io-client";

const URL = "https://video-stream-backend.vercel.app/api/socketio";

export const socket = io(URL);