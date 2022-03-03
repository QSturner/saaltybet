/*
This class provides an interface for all possible interactions with a Bet.
It also implements the controller for BettingPools and allows a passthrough to the payout methods for the betting pools.

Idea is that the bet commands implement this controller and only access its functions to retrieve and alter the State of the Database.

*/

//erstelle Neue Wette mit 2 Pools.
/* Wette Klassen Erweiterung:
  +-> Wette Model Instanz
  ++-> Pool Instanz Fighter A
   +--> Transactions für Kämpfer A [...]
  +--> Pool Instanz Fighter A
   +--> Transactions für Kämpfer B [...]
*/

const transaction = require("../Database/Controllers/generateTransaction.js")
const betPool = require("../Database/Controllers/betPoolController.js")

class betController {
  //public members
  publicResponseMessage = "";

  //private members
  #databaseContext;
  #BetInstance;
  #controllerBetPoolA; // references to the BetPoolController
  #controllerBetPoolB;


  constructor(databaseContext) {
    // to make a new Controller, it should just need the databaseContext, all other operations depend on the command.
    // initalize the model with the bare databaseContext.
    this.#databaseContext = databaseContext;
    this.#BetInstance = databaseContext.models['tblBets'];
    this.#controllerBetPoolA = databaseContext.models['tblPoolBet'];
    this.#controllerBetPoolB = databaseContext.models['tblPoolBet'];
    this.publicResponseMessage = "BetController initialized."
    console.log(this.publicResponseMessage)
  }


  /*
    Function that generates a new Bet and the BetPools.
  */
    newBet() {
      #BetInstance.create();

    }
    /*
      Function that grabs the last created bet and assigns it to the controller members.
    */
    getLastBet(){

    }

  /*
    Function that sets the current betInstance as active.
  */
  openBet() {
    #BetInstance.open = true;
  }
  /*
    Function that closes the Bet and starts the payout of the BetPools.
  */
  closeBet() {
    #BetInstance.open = false;
    #beginPayout();
  }

  /*control function that shows if the assigned bet is open or closed. */
  isOpen() {
    if (this.#BetInstance.open === true) {
      return this.#BetInstance.open
    } else {
      return false;
    }
  }

  /*
    Put money on a Player if possible and take that money from the Users account.
  */
  betOnPlayer(playerNumber,amount,message) {

  }

  payoutWinners(playerNumber) {

  }



}

module.exports = betController;


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
