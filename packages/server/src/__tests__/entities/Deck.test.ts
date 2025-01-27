import { Deck } from "../../core/entities/Deck";
import { Card, CardType } from "../../core/entities/Card";

describe("Deck", () => {
  let deck: Deck;

  beforeEach(() => {
    deck = new Deck();
  });

  describe("Deck Creation", () => {
    it("should create a deck with correct number of cards", () => {
      // 5 character types × 3 copies each = 15 cards
      expect(deck.remainingCards()).toBe(15);
    });

    it("should have correct distribution of cards", () => {
      const cards = deck.getCards();
      const cardCounts = new Map<CardType, number>();

      cards.forEach((card) => {
        const type = card.getType();
        cardCounts.set(type, (cardCounts.get(type) || 0) + 1);
      });

      // Each character should have exactly 3 copies
      Object.values(CardType).forEach((type) => {
        expect(cardCounts.get(type)).toBe(3);
      });
    });
  });

  describe("Card Drawing", () => {
    it("should allow drawing cards", () => {
      const initialCount = deck.remainingCards();
      const card = deck.draw();

      expect(card).toBeInstanceOf(Card);
      expect(deck.remainingCards()).toBe(initialCount - 1);
    });

    it("should throw error when drawing from empty deck", () => {
      // Draw all cards
      while (deck.remainingCards() > 0) {
        deck.draw();
      }

      expect(() => deck.draw()).toThrow("No cards left in deck");
    });
  });

  describe("Deck Shuffling", () => {
    it("should shuffle the deck", () => {
      // Create multiple decks and verify that orders are different
      const decks: Deck[] = Array.from({ length: 10 }, () => new Deck());

      // Get card orders from all decks
      const cardOrders = decks.map((d) =>
        d.getCards().map((card) => card.getType())
      );

      // Check if at least two different orders exist
      const uniqueOrders = new Set(cardOrders.map((order) => order.join(",")));
      expect(uniqueOrders.size).toBeGreaterThan(1);
    });

    it("should maintain correct number of cards after shuffle", () => {
      const initialCount = deck.remainingCards();
      deck.shuffle();
      expect(deck.remainingCards()).toBe(initialCount);
    });
  });
});
