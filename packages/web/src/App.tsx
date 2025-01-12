import { useEffect, useState } from "react";
import { useSocket } from "./hooks/useSocket";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import "@/App.css";
import { GameView } from "@/components/game/GameView";
import { GameState } from "@/types/game";
import { Character, Player } from "@coup/shared";

function App() {
  const socket = useSocket();
  const [connected, setConnected] = useState(false);
  const [gameId, setGameId] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [gameStatus, setGameStatus] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [isHost, setIsHost] = useState(false);
  const [gameState, setGameState] = useState<GameState>(GameState.LOBBY);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      setConnected(true);
    });

    socket.on("disconnect", () => {
      setConnected(false);
    });

    socket.on("gameCreated", (id: string) => {
      setGameId(id);
      setGameStatus(`Game created! ID: ${id}`);
      setIsHost(true);
    });

    socket.on("gameJoined", (id: string) => {
      setGameStatus(`Successfully joined game ${id}`);
    });

    socket.on("playerListUpdate", (playerList: Player[]) => {
      setPlayers(playerList);
    });

    socket.on("error", (message: string) => {
      setGameStatus(`Error: ${message}`);
    });

    socket.on("playerLeft", (message: string) => {
      setGameStatus((prevStatus) => `${prevStatus}\n${message}`);
    });

    socket.on("gameStarted", (data) => {
      setGameStatus("Game started!");
      setPlayers(data.players);
      setGameState(GameState.PLAYING);
      const player = data.players.find((p: Player) => p.id === socket.id);
      if (player) setCurrentPlayer(player);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("gameCreated");
      socket.off("gameJoined");
      socket.off("playerListUpdate");
      socket.off("error");
      socket.off("playerLeft");
    };
  }, [socket]);

  const handleCreateGame = () => {
    if (!socket || !playerName) return;
    socket.emit("createGame", playerName);
  };

  const handleJoinGame = () => {
    console.log("beforejoinGame", socket, gameId, playerName);
    if (!socket || !gameId || !playerName) return;
    socket.emit("joinGame", { gameId, playerName });
  };

  const handleStartGame = () => {
    if (!socket || !gameId) return;

    socket.emit("startGame", gameId);
  };

  // Mock data for development
  const mockGameState: GameState = {
    gameId: "game-123",
    players: [
      {
        id: "p1",
        name: "Player 1",
        coins: 2,
        cards: [Character.DUKE, Character.ASSASSIN],
        isAlive: true,
      },
      {
        id: "p2",
        name: "Player 2",
        coins: 3,
        cards: [Character.CAPTAIN, Character.CONTESSA],
        isAlive: true,
      },
      // Add more players...
    ],
    currentPlayerId: "p1",
    currentTurn: 1,
  };

  if ((gameState === GameState.PLAYING && currentPlayer) || true) {
    return <GameView players={3} />;
  }
  return <div className="bg-red-500 w-full h-full">home?</div>;
}

export default App;
