// # (Optional) Action handler implementations

import { GAME_RULES } from "../constants/gameRules";
import { Card, CardType } from "../entities/Card";
import { Game, PlayerState } from "../entities/Game";

export interface ExchangeOptions {
  drawnCards: Card[];
  currentCards: Card[];
}

export class ActionHandler {
  private game: Game;
  private pendingExchange: Map<string, ExchangeOptions> = new Map();

  constructor(game: Game) {
    this.game = game;
  }

  // Basic Actions
  public handleIncome(playerState: PlayerState): void {
    playerState.coins += GAME_RULES.INCOME_AMOUNT;
    this.game.nextTurn();
  }

  public handleForeignAid(playerState: PlayerState): void {
    // Can be blocked by Duke
    playerState.coins += GAME_RULES.FOREIGN_AID_AMOUNT;
    this.game.nextTurn();
  }

  public handleCoup(playerState: PlayerState, targetId: string): void {
    if (playerState.coins < GAME_RULES.COUP_COST) {
      throw new Error("Not enough coins for coup");
    }

    const targetState = this.game.getPlayerState(targetId);
    if (!targetState) {
      throw new Error("Target player not found");
    }

    playerState.coins -= GAME_RULES.COUP_COST;
    this.eliminateInfluence(targetState);
    this.game.nextTurn();
  }

  // Character Actions
  public handleDukeTax(playerState: PlayerState): void {
    playerState.coins += GAME_RULES.TAX_AMOUNT;
    this.game.nextTurn();
  }

  public handleAssassinate(playerState: PlayerState, targetId: string): void {
    if (playerState.coins < GAME_RULES.ASSASSINATE_COST) {
      throw new Error("Not enough coins for assassination");
    }

    const targetState = this.game.getPlayerState(targetId);
    if (!targetState) {
      throw new Error("Target player not found");
    }

    playerState.coins -= GAME_RULES.ASSASSINATE_COST;
    // Can be blocked by Contessa
    this.eliminateInfluence(targetState);
    this.game.nextTurn();
  }

  public handleSteal(playerState: PlayerState, targetId: string): void {
    if (playerState.coins < GAME_RULES.STEAL_COST) {
      throw new Error("Not enough coins for steal");
    }

    const targetState = this.game.getPlayerState(targetId);
    if (!targetState) {
      throw new Error("Target player not found");
    }

    // TODO: Can be blocked by Captain or Ambassador
    const stealAmount = Math.min(GAME_RULES.STEAL_AMOUNT, targetState.coins);
    targetState.coins -= stealAmount;
    playerState.coins += stealAmount;
    this.game.nextTurn();
  }

  public handleExchange(playerState: PlayerState): void {
    const drawnCards = [this.game.drawCard(), this.game.drawCard()];
    this.pendingExchange.set(playerState.player.getId(), {
      drawnCards,
      currentCards: [...playerState.cards],
    });
    // Don't call nextTurn() here - it happens after selection
  }

  public handleCompleteExchange(
    playerState: PlayerState,
    selectionStr: string
  ): void {
    const selectedIndexes = selectionStr.split(",").map(Number);

    const exchange = this.pendingExchange.get(playerState.player.getId());
    if (!exchange) {
      throw new Error("No pending exchange");
    }

    if (selectedIndexes.length !== 2) {
      throw new Error("Must select exactly 2 cards");
    }

    const allCards = [...exchange.currentCards, ...exchange.drawnCards];
    playerState.cards = selectedIndexes.map((i) => allCards[i]);

    const remainingCards = allCards.filter(
      (_, i) => !selectedIndexes.includes(i)
    );
    this.game.returnCardsToDeck(remainingCards);

    this.pendingExchange.delete(playerState.player.getId());
    this.game.nextTurn();
  }

  private eliminateInfluence(playerState: PlayerState): void {
    if (playerState.cards.length > 0) {
      // TODO: Let player choose which influence to lose
      playerState.cards.pop();
    }
  }

  // Helper method to check if player has a specific card
  private hasCard(playerState: PlayerState, cardType: CardType): boolean {
    return playerState.cards.some((card) => card.getType() === cardType);
  }
}
