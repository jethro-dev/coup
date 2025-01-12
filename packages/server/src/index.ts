import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import cors from "cors";
import { initializeSocketHandlers } from "./services/socketService";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

initializeSocketHandlers(io);

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
