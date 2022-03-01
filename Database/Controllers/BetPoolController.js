/*
This class provides an interface for all possible interactions with a Bet Pool.
It gets implemented exclusively by the Bet controller (1 Bet to 2 Bet Pools)

Idea is that the bet commands implement this controller and only access its functions to retrieve and alter the State of the Database.

*/

/*
possible actions:
  * evaluate pool status (number of betters, sum of pool content)
  * return payout information (list of users that betted in this pool + their original contribution and the resulting payout)
    for further processing in the Bet Controller.

*/

//erstelle Neue Wette mit 2 Pools.
/* Wette Klassen Erweiterung:
  +-> Wette Model Instanz
  ++-> Pool Instanz Fighter A
   +--> Transactions für Kämpfer A [...]
  +--> Pool Instanz Fighter A
   +--> Transactions für Kämpfer B [...]
*/

/* BetPool fields:
  runningBetID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bettingpool: DataTypes.DOUBLE,
  fighterNo: DataTypes.INTEGER, // fuck it, we want giant battles.

 */

/* things we need:
- query for all transactions with the currentBetID and the current fighter
-

*/


console.log("BetPoolController loaded for some effin reason");
