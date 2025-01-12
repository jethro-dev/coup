import { Server, Socket } from "socket.io";
import { gameService } from "../services/gameService";

export function setupDisconnectHandler(io: Server, socket: Socket) {
  socket.on("disconnect", () => {
    // Find any game this player is in
    for (const [gameId, game] of gameService.games) {
      if (game.players.has(socket.id)) {
        // Remove player from game
        game.players.delete(socket.id);

        // If game is empty, remove it
        if (game.players.size === 0) {
          gameService.games.delete(gameId);
        } else {
          // Notify remaining players
          const playerList = Array.from(game.players.values());
          io.to(gameId).emit("playerListUpdate", playerList);
          io.to(gameId).emit("playerLeft", `A player has left the game`);
        }
        break;
      }
    }
  });
}
