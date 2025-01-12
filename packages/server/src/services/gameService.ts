import { Game, Player } from "@coup/shared/src/types/game";
import { Server } from "socket.io";

export class GameService {
  private games: Map<string, Game> = new Map();

  createGame(playerId: string, playerName: string): Game {
    const gameId = Math.random().toString(36).substring(2, 8).toUpperCase();

    const game: Game = {
      id: gameId,
      players: new Map(),
      status: "waiting",
      currentTurn: null,
    };

    const pregamePlayerObj: Player = {
      id: playerId,
      name: playerName,
      coins: 2,
      cards: [],
      isAlive: true,
    };

    game.players.set(playerId, pregamePlayerObj);

    this.games.set(gameId, game);
    return game;
  }

  joinGame(gameId: string, playerId: string, playerName: string): Game | null {
    console.log("joinGame", gameId, playerId, playerName);
    const game = this.games.get(gameId);
    if (!game) return null;

    const pregamePlayerObj: Player = {
      id: playerId,
      name: playerName,
      coins: 2,
      cards: [],
      isAlive: true,
    };

    game.players.set(playerId, pregamePlayerObj);

    return game;
  }

  startGame(gameId: string, io: Server): Game | null {
    const game = this.games.get(gameId);
    if (!game) return null;

    game.status = "playing";

    // Notify all players in the game
    for (const [playerId, player] of game.players) {
      io.to(playerId).emit("gameStarted", {
        gameId,
        players: Array.from(game.players.values()).map((p) => ({
          ...p,
          // Only send cards to the player they belong to
          cards: p.id === playerId ? p.cards : ["hidden", "hidden"],
        })),
      });
    }

    return game;
  }

  getGame(gameId: string): Game | undefined {
    console.log("Games", this.games);
    return this.games.get(gameId);
  }

  getPlayers(gameId: string): Player[] {
    const game = this.games.get(gameId);
    return game ? Array.from(game.players.values()) : [];
  }
}

export const gameService = new GameService();
