import { gameService } from "../services/gameService";
import { Server } from "socket.io";
export function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

export function emitPlayerList(io: Server, gameId: string) {
  const game = gameService.getGame(gameId);
  if (!game) return;

  const playerList = Array.from(game.players.values());
  io.to(gameId).emit("playerListUpdate", playerList);
}
