import { Server, Socket } from "socket.io";
import { gameService } from "../services/gameService";
import { handleGameAction } from "./actions";
import { GameAction } from "@coup/shared";

export function setupActionHandlers(io: Server, socket: Socket) {
  socket.on("playAction", (gameId: string, action: GameAction) => {
    const game = gameService.getGame(gameId);
    if (!game || game.status !== "playing") return;
    if (game.currentTurn !== socket.id) return;

    action.from = socket.id;
    game.currentAction = action;

    // Handle immediate actions (like income)
    if (handleGameAction(game, socket.id, action)) {
      game.actionHistory.push(action);

      // Move to next player
      const playerIds = Array.from(game.players.keys()).filter(
        (id) => game.players.get(id)!.isAlive
      );
      const currentIndex = playerIds.indexOf(socket.id);
      game.currentTurn = playerIds[(currentIndex + 1) % playerIds.length];

      // Emit game update
      io.to(gameId).emit("gameUpdate", {
        action: action,
        nextPlayer: game.currentTurn,
        players: Array.from(game.players.entries()).map(([id, player]) => ({
          id,
          name: player.name,
          coins: player.coins,
          cardCount: player.cards.length,
          isAlive: player.isAlive,
        })),
      });
    }
  });
}
