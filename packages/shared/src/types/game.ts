import { Player } from "./player";

export enum Character {
  DUKE = "duke",
  ASSASSIN = "assassin",
  CAPTAIN = "captain",
  AMBASSADOR = "ambassador",
  CONTESSA = "contessa",
}

export const ALL_CHARACTERS = [
  Character.DUKE,
  Character.ASSASSIN,
  Character.CAPTAIN,
  Character.AMBASSADOR,
  Character.CONTESSA,
];

export type GameAction =
  | { type: "income" }
  | { type: "foreign_aid" }
  | { type: "coup"; target: string }
  | { type: "tax" }
  | { type: "assassinate"; target: string }
  | { type: "steal"; target: string }
  | { type: "exchange" }
  | { type: "challenge"; challenger: string; target: string; action: string }
  | { type: "block"; blocker: string; target: string; action: string };

export interface GameState {
  players: Player[];
  currentPlayerIndex: number;
  isGameOver: boolean;
  winner?: Player;
  currentAction?: GameAction;
  actionStack: GameAction[];
}

export interface Game {
  id: string;
  players: Map<string, Player>;
  status: "waiting" | "playing" | "finished";
  currentTurn: string | null;
}
