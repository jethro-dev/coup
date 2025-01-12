import { Character } from "./game";

export interface Player {
  // Basic player info
  id: string;
  name: string;

  // Game state
  coins: number;
  cards: Character[]; // Their influence cards
  isAlive: boolean; // False when they lose all influences

  // Optional properties for more game states
  isReady?: boolean; // For lobby state
  isConnected?: boolean; // For tracking connection status
}
