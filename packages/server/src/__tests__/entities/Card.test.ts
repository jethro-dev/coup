import { Card, CardType } from "../../core/entities/Card";

describe("Card", () => {
  describe("Card Creation", () => {
    it("should create a card with the correct type", () => {
      const card = new Card({ type: CardType.DUKE });
      expect(card.getType()).toBe(CardType.DUKE);
    });
  });

  describe("Card Types", () => {
    it("should support all character types", () => {
      const types = [
        CardType.DUKE,
        CardType.ASSASSIN,
        CardType.CAPTAIN,
        CardType.AMBASSADOR,
        CardType.CONTESSA,
      ];

      types.forEach((type) => {
        const card = new Card({ type });
        expect(card.getType()).toBe(type);
      });
    });
  });
});
