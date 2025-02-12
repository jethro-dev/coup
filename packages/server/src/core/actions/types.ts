export enum GameAction {
  // Basic Actions
  INCOME = "INCOME",
  FOREIGN_AID = "FOREIGN_AID",
  COUP = "COUP",

  // Character Actions
  DUKE_TAX = "DUKE_TAX",
  ASSASSINATE = "ASSASSINATE",
  STEAL = "STEAL",
  EXCHANGE = "EXCHANGE",
  COMPLETE_EXCHANGE = "COMPLETE_EXCHANGE",

  // Challenge
  // CHALLENGE = "CHALLENGE",
  // CHALLENGE_SUCCESS = "CHALLENGE_SUCCESS",
  // CHALLENGE_FAILURE = "CHALLENGE_FAILURE",
}

export enum CounterAction {
  BLOCK_FOREIGN_AID = "BLOCK_FOREIGN_AID",
  BLOCK_STEAL = "BLOCK_STEAL",
  BLOCK_ASSASSINATE = "BLOCK_ASSASSINATE",
}
