import { io } from "socket.io-client";

export const BASE_URL = "https://video-stream-backend.vercel.app";

export const socket = io(BASE_URL);