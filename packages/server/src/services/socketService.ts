import { Server, Socket } from "socket.io";
import { gameService } from "./gameService";
import { setupGameHandlers } from "../game/handlers";
import { setupDisconnectHandler } from "../game/disconnectHandler";
import { setupActionHandlers } from "../game/actionHandlers";
import { GameAction } from "@coup/shared";

export function initializeSocketHandlers(io: Server) {
  io.on("connection", (socket: Socket) => {
    console.log(`New connection, Socket ID: ${socket.id}`);

    setupGameHandlers(io, socket);
    setupActionHandlers(io, socket);
    setupDisconnectHandler(io, socket);
  });
}
