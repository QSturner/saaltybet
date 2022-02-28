/*
This class provides an interface for all possible interactions with a Bet.
It also implements the controller for BettingPools and allows a passthrough to the payout methods for the betting pools.

Idea is that the bet commands implement this controller and only access its functions to retrieve and alter the State of the Database.

*/

/*
Bet fields:
  betID: type: DataTypes.INTEGER, PK
  // runtime of the bet. after the end a winner gets declared and payouts happen
  betStart: DataTypes.DATE,
  betEnd: DataTypes.DATE,
  isOpen: { // if true, betting is possible if closed, no more bets.
    type: DataTypes.BOOLEAN,
    default: true,
  },

*/

console.log("BetController loaded for some effin reason");