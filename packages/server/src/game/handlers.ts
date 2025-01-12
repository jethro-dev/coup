import { Server, Socket } from "socket.io";
import { gameService } from "../services/gameService";

import { ALL_CHARACTERS } from "@coup/shared";
import { emitPlayerList } from "../utils/gameUtils";

export function setupGameHandlers(io: Server, socket: Socket) {
  socket.on("createGame", (playerName: string) => {
    const game = gameService.createGame(socket.id, playerName);
    socket.join(game.id);
    socket.emit("gameCreated", game.id);
    emitPlayerList(io, game.id);
  });

  socket.on("joinGame", ({ gameId, playerName }) => {
    const game = gameService.joinGame(gameId, socket.id, playerName);
    if (!game) {
      socket.emit("error", "Game not found");
      return;
    }
    socket.join(gameId);
    socket.emit("gameJoined", gameId);
    emitPlayerList(io, gameId);
  });

  socket.on("startGame", (gameId: string) => {
    const game = gameService.startGame(gameId, io);
    if (!game) {
      socket.emit("error", "Game not found");
    }
  });
}
