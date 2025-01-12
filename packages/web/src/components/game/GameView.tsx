import { cn } from "@/lib/utils";
import { Character, GameState } from "@coup/shared";
import { CharacterCard } from "./CharacterCard";
import { PlayerHand } from "./player-hand";
import { Button } from "../ui/button";
import { Player } from "@coup/shared/dist/types/player";
import { GameControls } from "./game-controls";
import { TableView } from "./table-view";

interface GameViewProps {
  // gameId: string;
  // players: Player[];
  // currentPlayer: Player;
  players: number;
}

export function GameView({ players }: GameViewProps) {
  // { gameId, players, currentPlayer }: GameViewProps
  // For now, we'll just use mock cards

  return (
    <>
      {/* Opponent's hand (top) */}

      <TableView numOfPlayers={1} />

      {/* <GameControls /> */}
      {/* <CharacterCard character={Character.DUKE} /> */}
    </>
  );
}
