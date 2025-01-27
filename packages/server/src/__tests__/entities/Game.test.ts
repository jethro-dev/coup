import { Game } from "../../core/entities/Game";
import { Room } from "../../core/entities/Room";
import { Player } from "../../core/entities/Player";
import { Card } from "../../core/entities/Card";
import { GameAction } from "../../core/actions/types";

describe("Game", () => {
  let room: Room;
  let players: Player[];
  let game: Game;

  beforeEach(() => {
    room = new Room({ id: "room-1" });
    players = [
      new Player({ id: "p1", name: "Player 1" }),
      new Player({ id: "p2", name: "Player 2" }),
      new Player({ id: "p3", name: "Player 3" }),
    ];
    players.forEach((p) => room.addPlayer(p));
    game = new Game({ room });
  });

  describe("Game Creation", () => {
    it("should not create game with insufficient players", () => {
      const emptyRoom = new Room({ id: "room-2" });
      expect(() => new Game({ room: emptyRoom })).toThrow();
    });

    it("should initialize all players with correct starting state", () => {
      players.forEach((player) => {
        const state = game.getPlayerState(player.getId());
        expect(state).not.toBeNull();
        expect(state?.coins).toBe(2);
        expect(state?.cards).toHaveLength(2);
        expect(state?.cards[0]).toBeInstanceOf(Card);
        expect(state?.cards[1]).toBeInstanceOf(Card);
      });
    });

    it("should deal correct number of cards from deck", () => {
      // 15 cards in deck - (2 cards × 3 players) = 9 cards remaining
      expect(game.getRemainingCards()).toBe(9);
    });
  });

  describe("Turn Management", () => {
    it("should rotate turns through all players", () => {
      const firstPlayer = game.getCurrentPlayer();
      const seenPlayers = new Set([firstPlayer]);

      // Go through one complete round
      for (let i = 0; i < players.length - 1; i++) {
        game.nextTurn();
        const currentPlayer = game.getCurrentPlayer();
        seenPlayers.add(currentPlayer);
      }

      // Should have seen each player exactly once
      expect(seenPlayers.size).toBe(players.length);

      // Should return to first player
      game.nextTurn();
      expect(game.getCurrentPlayer()).toBe(firstPlayer);
    });
  });

  describe("Player Order", () => {
    it("should have all players from the room", () => {
      const gamePlayers = game.getPlayers();
      expect(gamePlayers).toHaveLength(players.length);
      players.forEach((p) => {
        expect(gamePlayers).toContainEqual(p);
      });
    });

    it("should randomize player order", () => {
      const games: Game[] = Array.from(
        { length: 10 },
        () => new Game({ room })
      );

      const playerOrders = games.map((g) =>
        g.getPlayers().map((p) => p.getId())
      );

      const uniqueOrders = new Set(
        playerOrders.map((order) => order.join(","))
      );
      expect(uniqueOrders.size).toBeGreaterThan(1);
    });
  });

  describe("Player State", () => {
    it("should maintain player states", () => {
      const player = players[0];
      const state = game.getPlayerState(player.getId());

      expect(state).not.toBeNull();
      expect(state?.player).toBe(player);
      expect(state?.coins).toBe(2);
      expect(state?.cards).toHaveLength(2);
    });

    it("should return null for invalid player id", () => {
      expect(game.getPlayerState("invalid-id")).toBeNull();
    });
  });

  describe("Game Actions", () => {
    describe("Income", () => {
      it("should allow player to take income", () => {
        const currentPlayer = game.getCurrentPlayer();
        const initialState = game.getPlayerState(currentPlayer.getId())!;
        const initialCoins = initialState.coins;

        game.performAction(GameAction.INCOME, currentPlayer.getId());

        const newState = game.getPlayerState(currentPlayer.getId())!;
        expect(newState.coins).toBe(initialCoins + 1);
      });

      it("should not allow out-of-turn actions", () => {
        const notCurrentPlayer = players.find(
          (p) => p !== game.getCurrentPlayer()
        )!;

        expect(() =>
          game.performAction(GameAction.INCOME, notCurrentPlayer.getId())
        ).toThrow("Not your turn");
      });
    });

    describe("Coup", () => {
      it("should require 7 coins for coup", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        expect(() =>
          game.performAction(
            GameAction.COUP,
            currentPlayer.getId(),
            targetPlayer.getId()
          )
        ).toThrow("Not enough coins for coup");
      });

      it("should eliminate influence when coup successful", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        // Give enough coins for coup
        const state = game.getPlayerState(currentPlayer.getId())!;
        state.coins = 7;

        const targetInitialCards = game.getPlayerState(targetPlayer.getId())!
          .cards.length;

        game.performAction(
          GameAction.COUP,
          currentPlayer.getId(),
          targetPlayer.getId()
        );

        const targetFinalCards = game.getPlayerState(targetPlayer.getId())!
          .cards.length;
        expect(targetFinalCards).toBe(targetInitialCards - 1);
      });
    });

    describe("Assassinate", () => {
      it("should require 3 coins for assassination", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        expect(() =>
          game.performAction(
            GameAction.ASSASSINATE,
            currentPlayer.getId(),
            targetPlayer.getId()
          )
        ).toThrow("Not enough coins for assassination");
      });

      it("should eliminate influence when assassination successful", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        // Give enough coins for assassination
        const state = game.getPlayerState(currentPlayer.getId())!;
        state.coins = 3;

        const targetInitialCards = game.getPlayerState(targetPlayer.getId())!
          .cards.length;

        game.performAction(
          GameAction.ASSASSINATE,
          currentPlayer.getId(),
          targetPlayer.getId()
        );

        const targetFinalCards = game.getPlayerState(targetPlayer.getId())!
          .cards.length;
        expect(targetFinalCards).toBe(targetInitialCards - 1);
      });
    });

    describe("Steal", () => {
      it("should require 3 coins for steal", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        expect(() =>
          game.performAction(
            GameAction.STEAL,
            currentPlayer.getId(),
            targetPlayer.getId()
          )
        ).toThrow("Not enough coins for steal");
      });

      it("should steal 2 coins from target", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        // Give enough coins for steal
        const state = game.getPlayerState(currentPlayer.getId())!;
        state.coins = 3;

        const targetInitialCoins = game.getPlayerState(
          targetPlayer.getId()
        )!.coins;
        const selfInitialCoins = game.getPlayerState(
          currentPlayer.getId()
        )!.coins;

        game.performAction(
          GameAction.STEAL,
          currentPlayer.getId(),
          targetPlayer.getId()
        );

        const targetFinalCoins = game.getPlayerState(
          targetPlayer.getId()
        )!.coins;
        expect(targetFinalCoins).toBe(targetInitialCoins - 2);

        const selfFinalCoins = game.getPlayerState(
          currentPlayer.getId()
        )!.coins;
        expect(selfFinalCoins).toBe(selfInitialCoins + 2);
      });
    });

    describe("Exchange", () => {
      it("should allow player to exchange cards", () => {
        const currentPlayer = game.getCurrentPlayer();
        const initialState = game.getPlayerState(currentPlayer.getId())!;
        const initialCards = [...initialState.cards]; // Make a copy

        // Start exchange
        game.performAction(GameAction.EXCHANGE, currentPlayer.getId());

        // Select the two NEW cards (indexes 2,3) instead of original cards (0,1)
        game.performAction(
          GameAction.COMPLETE_EXCHANGE,
          currentPlayer.getId(),
          "2,3" // Select the drawn cards instead of original ones
        );

        const finalCards = game.getPlayerState(currentPlayer.getId())!.cards;
        expect(finalCards).toHaveLength(2);
        expect(finalCards).not.toEqual(initialCards);
      });
    });

    describe("Assassinate", () => {
      it("should require 3 coins for assassination", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        const targetInitialCards = game.getPlayerState(targetPlayer.getId())!
          .cards.length;
        const currentInitialCards = game.getPlayerState(currentPlayer.getId())!
          .cards.length;

        expect(() =>
          game.performAction(
            GameAction.ASSASSINATE,
            currentPlayer.getId(),
            targetPlayer.getId()
          )
        ).toThrow("Not enough coins for assassination");
      });

      it("should eliminate influence when assassination successful", () => {
        const currentPlayer = game.getCurrentPlayer();
        const targetPlayer = players.find((p) => p !== currentPlayer)!;

        // Give enough coins for assassination
        const state = game.getPlayerState(currentPlayer.getId())!;
        state.coins = 3;

        const targetInitialCards = game.getPlayerState(targetPlayer.getId())!
          .cards.length;

        game.performAction(
          GameAction.ASSASSINATE,
          currentPlayer.getId(),
          targetPlayer.getId()
        );

        const targetFinalCards = game.getPlayerState(targetPlayer.getId())!
          .cards.length;
        expect(targetFinalCards).toBe(targetInitialCards - 1);
      });

      it("should not allow out-of-turn actions", () => {
        const notCurrentPlayer = players.find(
          (p) => p !== game.getCurrentPlayer()
        )!;
        const targetPlayer = players.find((p) => p !== notCurrentPlayer)!;

        expect(() =>
          game.performAction(
            GameAction.ASSASSINATE,
            notCurrentPlayer.getId(),
            targetPlayer.getId()
          )
        ).toThrow("Not your turn");
      });
    });
  });
});
