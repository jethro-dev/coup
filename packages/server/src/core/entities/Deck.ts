import { Card, CardType } from "./Card";

export class Deck {
  private cards: Card[];

  constructor() {
    this.cards = this.initializeDeck();
    this.shuffle();
  }

  public getCards(): Card[] {
    return [...this.cards]; // Return a copy to prevent external modification
  }

  public draw(): Card {
    if (this.cards.length === 0) {
      throw new Error("No cards left in deck");
    }
    return this.cards.pop()!;
  }

  public returnCards(cards: Card[]): void {
    this.cards.push(...cards);
    this.shuffle();
  }

  public shuffle(): void {
    // Fisher-Yates shuffle algorithm
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  private initializeDeck(): Card[] {
    const cards: Card[] = [];
    const cardTypes = Object.values(CardType);

    // Add 3 copies of each card type
    cardTypes.forEach((type) => {
      for (let i = 0; i < 3; i++) {
        cards.push(new Card({ type }));
      }
    });

    return cards;
  }

  public remainingCards(): number {
    return this.cards.length;
  }
}
