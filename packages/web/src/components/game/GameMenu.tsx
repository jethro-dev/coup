import { useState } from "react";
import { Socket } from "socket.io-client";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface GameMenuProps {
  socket: Socket | null;
  isHost: boolean;
  gameId: string;
  playerName: string;
  gameStatus: string;
  players: { id: string; name: string }[];
  onPlayerNameChange: (name: string) => void;
  onGameIdChange: (id: string) => void;
  onCreateGame: () => void;
  onJoinGame: () => void;
  onStartGame: () => void;
}

export const GameMenu = ({
  socket,
  isHost,
  gameId,
  playerName,
  gameStatus,
  players,
  onPlayerNameChange,
  onGameIdChange,
  onCreateGame,
  onJoinGame,
  onStartGame,
}: GameMenuProps) => {
  const [activeTab, setActiveTab] = useState<"create" | "join">("create");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <Card className="w-full max-w-md p-6 space-y-6 bg-gray-800 border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Coup</h1>
          <p className="text-gray-400">A game of deception and strategy</p>
        </div>

        <div className="flex space-x-2 mb-4">
          <Button
            variant={activeTab === "create" ? "default" : "secondary"}
            className="flex-1"
            onClick={() => setActiveTab("create")}
          >
            Create Game
          </Button>
          <Button
            variant={activeTab === "join" ? "default" : "secondary"}
            className="flex-1"
            onClick={() => setActiveTab("join")}
          >
            Join Game
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <Input
              placeholder="Your Name"
              value={playerName}
              onChange={(e) => onPlayerNameChange(e.target.value)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>

          {activeTab === "join" && (
            <div>
              <Input
                placeholder="Game ID"
                value={gameId}
                onChange={(e) => onGameIdChange(e.target.value)}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
          )}

          <div className="flex justify-center">
            {activeTab === "create" ? (
              <Button
                className="w-full"
                onClick={onCreateGame}
                disabled={!socket || !playerName}
              >
                Create New Game
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={onJoinGame}
                disabled={!socket || !gameId || !playerName}
              >
                Join Game
              </Button>
            )}
          </div>
        </div>

        {gameId && (
          <div className="space-y-4">
            <div className="p-3 bg-gray-700 rounded-lg">
              <p className="text-gray-300 text-sm font-mono">
                Game ID: {gameId}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-white font-semibold">Players:</h3>
              <div className="bg-gray-700 rounded-lg p-2">
                {players.map((player) => (
                  <div
                    key={player.id}
                    className="text-gray-300 py-1 px-2 rounded"
                  >
                    {player.name}
                  </div>
                ))}
              </div>
            </div>

            {isHost && players.length >= 2 && (
              <Button
                className="w-full"
                onClick={onStartGame}
                disabled={!socket || players.length < 2}
              >
                Start Game
              </Button>
            )}
          </div>
        )}

        {gameStatus && (
          <div className="p-3 bg-gray-700 rounded-lg">
            <p className="text-gray-300 text-sm whitespace-pre-line">
              {gameStatus}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
};
