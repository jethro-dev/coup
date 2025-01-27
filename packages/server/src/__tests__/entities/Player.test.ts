import { Player } from "../../core/entities/Player";

describe("Player", () => {
  it("should create a player with the correct properties", () => {
    const player = new Player({ id: "1", name: "John Doe" });
    expect(player.getId()).toBe("1");
    expect(player.getName()).toBe("John Doe");
  });

  describe("coin management", () => {
    it("should add coins to the player", () => {
      const player = new Player({ id: "1", name: "John Doe" });
      player.addCoins(10);
      expect(player.getCoins()).toBe(10);
    });

    it("should not allow negative coin additions", () => {
      const player = new Player({ id: "1", name: "John Doe" });
      expect(() => player.addCoins(-5)).toThrow("Cannot add negative coins");
      expect(player.getCoins()).toBe(0);
    });

    it("should remove coins from the player", () => {
      const player = new Player({ id: "1", name: "John Doe" });
      player.addCoins(20);
      player.removeCoins(5);
      expect(player.getCoins()).toBe(15);
    });

    it("should deduct to zero if more coins are removed than available", () => {
      const player = new Player({ id: "1", name: "John Doe" });
      player.addCoins(10);
      player.removeCoins(15);
      expect(player.getCoins()).toBe(0);
    });
  });

  describe("player properties", () => {
    it("should not allow empty player name", () => {
      expect(() => new Player({ id: "1", name: "" })).toThrow(
        "Name cannot be empty"
      );
    });

    it("should not allow empty player id", () => {
      expect(() => new Player({ id: "", name: "John Doe" })).toThrow(
        "ID cannot be empty"
      );
    });

    it("should initialize with zero coins by default", () => {
      const player = new Player({ id: "1", name: "John Doe" });
      expect(player.getCoins()).toBe(0);
    });
  });
});
