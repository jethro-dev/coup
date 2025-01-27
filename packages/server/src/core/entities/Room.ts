import { Player } from "./Player";

export interface RoomProps {
  id: string;
}

export class Room {
  private readonly id: string;
  private readonly players: Map<string, Player>;
  private readonly playerOrder: string[]; // maintains player order

  constructor(props: RoomProps) {
    this.id = props.id;
    this.players = new Map();
    this.playerOrder = [];
  }

  public getId(): string {
    return this.id;
  }

  public getPlayers(): Player[] {
    return this.playerOrder.map((id) => this.players.get(id)!);
  }

  public addPlayer(player: Player): void {
    if (this.players.size >= 6) {
      throw new Error("Room is full");
    }

    if (this.players.has(player.getId())) {
      throw new Error("Player already exists in room");
    }

    this.players.set(player.getId(), player);
    this.playerOrder.push(player.getId());
  }

  public removePlayer(playerId: string): void {
    if (!this.players.has(playerId)) {
      throw new Error("Player not found");
    }

    this.players.delete(playerId);
    const index = this.playerOrder.indexOf(playerId);
    if (index > -1) {
      this.playerOrder.splice(index, 1);
    }
  }

  public getPlayerById(playerId: string): Player | null {
    return this.players.get(playerId) || null;
  }

  public hasPlayer(playerId: string): boolean {
    return this.players.has(playerId);
  }

  public canStart(): boolean {
    return this.players.size >= 2;
  }
}
