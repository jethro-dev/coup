import { Player } from "./Player";
import { Room } from "./Room";
import { Deck } from "./Deck";
import { Card } from "./Card";

import { GAME_RULES } from "../constants/gameRules";
import { GameAction } from "../actions/types";
import { ActionHandler } from "../actions/handlers";

export interface PlayerState {
  player: Player;
  coins: number;
  cards: Card[];
}

export interface GameProps {
  room: Room;
}

export class Game {
  private readonly playerStates: Map<string, PlayerState>;
  private readonly playerOrder: Player[];
  private currentPlayerIndex: number;
  private deck: Deck;
  private readonly actionHandler: ActionHandler;

  constructor(props: GameProps) {
    if (!props.room.canStart()) {
      throw new Error("Not enough players to start game");
    }

    this.deck = new Deck();
    this.playerStates = new Map();
    this.playerOrder = this.shufflePlayers(props.room.getPlayers());
    this.currentPlayerIndex = 0;
    this.actionHandler = new ActionHandler(this);

    // Initialize player states and deal cards
    this.initializePlayerStates();
  }

  private shufflePlayers(players: Player[]): Player[] {
    const shuffled = [...players];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  private initializePlayerStates(): void {
    this.playerOrder.forEach((player) => {
      this.playerStates.set(player.getId(), {
        player,
        coins: GAME_RULES.STARTING_COINS,
        cards: [this.deck.draw(), this.deck.draw()],
      });
    });
  }

  public getPlayers(): Player[] {
    return [...this.playerOrder];
  }

  public getCurrentPlayer(): Player {
    return this.playerOrder[this.currentPlayerIndex];
  }

  public nextTurn(): void {
    this.currentPlayerIndex =
      (this.currentPlayerIndex + 1) % this.playerOrder.length;
  }

  public getPlayerState(playerId: string): PlayerState | null {
    return this.playerStates.get(playerId) || null;
  }

  public getRemainingCards(): number {
    return this.deck.remainingCards();
  }

  public drawCard(): Card {
    return this.deck.draw();
  }

  public returnCardsToDeck(cards: Card[]): void {
    this.deck.returnCards(cards);
  }

  public performAction(
    action: GameAction,
    playerId: string,
    targetId?: string
  ): void {
    if (this.getCurrentPlayer().getId() !== playerId) {
      throw new Error("Not your turn");
    }

    const playerState = this.getPlayerState(playerId);
    if (!playerState) {
      throw new Error("Player not found");
    }

    const actionHandlers: Record<GameAction, () => void> = {
      [GameAction.INCOME]: () => this.actionHandler.handleIncome(playerState),
      [GameAction.FOREIGN_AID]: () =>
        this.actionHandler.handleForeignAid(playerState),
      [GameAction.COUP]: () => {
        if (!targetId) throw new Error("Target required for coup");
        this.actionHandler.handleCoup(playerState, targetId);
      },
      [GameAction.DUKE_TAX]: () =>
        this.actionHandler.handleDukeTax(playerState),
      [GameAction.ASSASSINATE]: () => {
        if (!targetId) throw new Error("Target required for assassination");
        this.actionHandler.handleAssassinate(playerState, targetId);
      },
      [GameAction.STEAL]: () => {
        if (!targetId) throw new Error("Target required for steal");
        this.actionHandler.handleSteal(playerState, targetId);
      },
      [GameAction.EXCHANGE]: () =>
        this.actionHandler.handleExchange(playerState),
      [GameAction.COMPLETE_EXCHANGE]: () => {
        if (!targetId) throw new Error("Target required for exchange");
        this.actionHandler.handleCompleteExchange(playerState, targetId);
      },
    };

    const handler = actionHandlers[action];
    if (!handler) {
      throw new Error("Invalid action");
    }

    handler();
  }
}
