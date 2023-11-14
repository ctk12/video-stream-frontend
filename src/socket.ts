import { io } from "socket.io-client";

const URL = "https://stream.tplinks.online";

export const socket = io(URL);