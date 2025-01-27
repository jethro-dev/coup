import { Room } from "../../core/entities/Room";
import { Player } from "../../core/entities/Player";

describe("Room", () => {
  let room: Room;
  let player: Player;

  beforeEach(() => {
    room = new Room({ id: "room-1" });
    player = new Player({ id: "player-1", name: "John Doe" });
  });

  describe("Room Creation", () => {
    it("should create a room with the correct properties", () => {
      expect(room.getId()).toBe("room-1");
      expect(room.getPlayers()).toHaveLength(0);
    });
  });

  describe("Player Management", () => {
    it("should add a player to the room", () => {
      room.addPlayer(player);
      expect(room.getPlayers()).toContain(player);
      expect(room.getPlayers()).toHaveLength(1);
    });

    it("should not add the same player twice", () => {
      room.addPlayer(player);
      expect(() => room.addPlayer(player)).toThrow(
        "Player already exists in room"
      );
      expect(room.getPlayers()).toHaveLength(1);
    });

    it("should remove a player from the room", () => {
      room.addPlayer(player);
      room.removePlayer(player.getId());
      expect(room.getPlayers()).not.toContain(player);
      expect(room.getPlayers()).toHaveLength(0);
    });

    it("should throw error when removing non-existent player", () => {
      expect(() => room.removePlayer("non-existent")).toThrow(
        "Player not found"
      );
    });
  });

  describe("Player Queries", () => {
    it("should find player by id", () => {
      room.addPlayer(player);
      const foundPlayer = room.getPlayerById(player.getId());
      expect(foundPlayer).toBe(player);
    });

    it("should return null when player not found", () => {
      expect(room.getPlayerById("non-existent")).toBeNull();
    });

    it("should check if player exists", () => {
      room.addPlayer(player);
      expect(room.hasPlayer(player.getId())).toBe(true);
      expect(room.hasPlayer("non-existent")).toBe(false);
    });
  });

  describe("Room Capacity", () => {
    it("should enforce maximum player limit", () => {
      // Create 5 additional players (total will be 6 with the first player)
      const players = Array.from(
        { length: 5 },
        (_, i) => new Player({ id: `player-${i + 2}`, name: `Player ${i + 2}` })
      );

      room.addPlayer(player); // Add first player (player-1)
      players.forEach((p) => room.addPlayer(p)); // Add players 2-6

      // Try to add a 7th player
      const extraPlayer = new Player({ id: "player-7", name: "Extra Player" });
      expect(() => room.addPlayer(extraPlayer)).toThrow("Room is full");
      expect(room.getPlayers()).toHaveLength(6);
    });

    it("should not create room with less than 2 players", () => {
      expect(room.getPlayers()).toHaveLength(0);
      room.addPlayer(player);
      expect(room.getPlayers()).toHaveLength(1);
      expect(room.canStart()).toBe(false);
    });

    it("should allow game to start with 2-6 players", () => {
      room.addPlayer(player);
      room.addPlayer(new Player({ id: "player-2", name: "Player 2" }));
      expect(room.canStart()).toBe(true);
    });
  });

  describe("Room State Validation", () => {
    it("should maintain player order as they join", () => {
      const player2 = new Player({ id: "player-2", name: "Player 2" });
      const player3 = new Player({ id: "player-3", name: "Player 3" });

      room.addPlayer(player);
      room.addPlayer(player2);
      room.addPlayer(player3);

      const players = room.getPlayers();
      expect(players[0].getId()).toBe("player-1");
      expect(players[1].getId()).toBe("player-2");
      expect(players[2].getId()).toBe("player-3");
    });

    it("should maintain correct player order after removing a player", () => {
      const player2 = new Player({ id: "player-2", name: "Player 2" });
      const player3 = new Player({ id: "player-3", name: "Player 3" });

      room.addPlayer(player);
      room.addPlayer(player2);
      room.addPlayer(player3);

      room.removePlayer(player2.getId());

      const players = room.getPlayers();
      expect(players).toHaveLength(2);
      expect(players[0].getId()).toBe("player-1");
      expect(players[1].getId()).toBe("player-3");
    });
  });
});
