import { Game, GameAction } from "@coup/shared";

export function handleGameAction(
  game: Game,
  playerId: string,
  action: GameAction
) {
  const player = game.players.get(playerId);
  if (!player || !player.isAlive) return false;

  switch (action.type) {
    case "income":
      return handleIncome(player);
    case "foreign_aid":
      return handleForeignAid(player, action);
    case "tax":
      return handleTax(player, action);
    case "coup":
      return handleCoup(game, player, action);
    default:
      return false;
  }
}

// Individual action handlers...
