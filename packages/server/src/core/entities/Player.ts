import { Character, PlayerStatus } from "@coup/shared";

export interface PlayerProps {
  id: string;
  name: string;
}

export class Player {
  private readonly id: string;
  private readonly name: string;
  private coins: number;
  private cards: Character[];
  private status: PlayerStatus;

  constructor(props: PlayerProps) {
    if (!props.id || props.id.trim() === "") {
      throw new Error("ID cannot be empty");
    }
    if (!props.name || props.name.trim() === "") {
      throw new Error("Name cannot be empty");
    }
    this.id = props.id;
    this.name = props.name;
    this.coins = 0; // Start with 2 coins by default
    this.cards = [];
    this.status = PlayerStatus.ALIVE;
  }

  // Getters
  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getCoins(): number {
    return this.coins;
  }

  public getCards(): Character[] {
    return [...this.cards]; // Return a copy to prevent mutation
  }

  public getStatus(): PlayerStatus {
    return this.status;
  }
  public setStatus(status: PlayerStatus): void {
    this.status = status;
  }

  public isAlive(): boolean {
    return this.status === PlayerStatus.ALIVE;
  }

  public killPlayer(): void {
    this.status = PlayerStatus.DEAD;
  }

  // Game actions
  public addCoins(amount: number): void {
    if (amount < 0) {
      throw new Error("Cannot add negative coins");
    }
    this.coins += amount;
  }
  public removeCoins(amount: number): void {
    this.coins = Math.max(0, this.coins - amount);
  }

  // For serialization
  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      coins: this.coins,
      cards: this.cards,
      status: this.status,
    };
  }
}
