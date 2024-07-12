import SocketIOClient from "socket.io-client";

const BASE_URL = "https://video-stream-backend.vercel.app";

const socket = SocketIOClient(BASE_URL, {
    path: "/api/socketio",
});

export { socket };