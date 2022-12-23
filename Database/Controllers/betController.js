/*
This class provides an interface for all possible interactions with a Bet.
It also implements the controller for BettingPools and allows a passthrough to the payout methods for the betting pools.

Idea is that the bet commands implement this controller and only access its functions to retrieve and alter the State of the Database.

*/

// rough structural draft: generate new bet with 2 Pools.
/* bet class draft:
  +-> bet DBModel instance
  ++-> PoolController instance Fighter A
   +--> Transactions for Fighter A [...]
  ++-> PoolController instance Fighter B
   +--> Transactions for Fighter B [...]
*/

/*
Bet fields:
  betID: type: DataTypes.INTEGER, PK
  // runtime of the bet. after the end a winner gets declared and payouts happen
  isOpen: { // if true, betting is possible if closed, no more bets.
    type: DataTypes.BOOLEAN,
    default: true,
  }, 
*/
const betPool = require("../Controllers/betPoolController.js");

class betController {
  //static members
  static ERRORCANNOTFINDLASTBET = "Can't find last bet! Oh no!";
  //public members
  publicResponseMessage = "";
  isInitialized = false;
  readyState = false;
  //private members
  #databaseContext;
  #BetInstance;
  #controllerBetPoolA; // references to the BetPoolController
  #controllerBetPoolB;
  //#GlobalBetPool = 0; // sum of betPool A and B used to make the calculations easier?
  #odds;

  constructor(databaseContext) {
    // initalize the model with the bare databaseContext.
    this.#databaseContext = databaseContext;
    this.#BetInstance = databaseContext.models['tblBets'];
    //build the betPoolControllers for each fighter
    this.#controllerBetPoolA = new betPool(this.#databaseContext,1);
    this.#controllerBetPoolB = new betPool(this.#databaseContext,2);
    // return feedback value for text-output and error handling/debugging
    this.publicResponseMessage = "BetController initialized.";
    // return feedback value for error handling and program flow outside of controller definition
    this.readyState = true;
    console.log(this.publicResponseMessage)
  }

  /*
    Method that refreshes all the Children of the Bet and reassigns them
    so all the pieces are in place when we need them.
    returns true on success
  */
  async initBetSubControllers(){
    
    console.log("initializing SubBets...");
    this.isInitialized = false;
    await this.#controllerBetPoolA.retrievePoolInstance(this.#BetInstance.betID).then( async () => {
    await this.#controllerBetPoolA.findAssignedBets(this.#BetInstance.betID);  
    });
    await this.#controllerBetPoolB.retrievePoolInstance(this.#BetInstance.betID).then( async () => {
    await this.#controllerBetPoolB.findAssignedBets(this.#BetInstance.betID);
    });
    
    return this.isInitialized = true;
  }
  
  /*
    Function that tries to generates a new Bet and the corosponding BetPools.
    Only creates a new bet if there are no open bets found in database.
    returns a boolean as a result veryfier
  */
  async newBet() {
    var result = false;
    this.publicResponseMessage = "looking for open Bet Instance...";
    const BetHelper = await this.#databaseContext.models['tblBets'].build();
    //console.log(BetHelper);
    let isBetOpen = await BetHelper.checkForOpenBets();
      console.log(isBetOpen);
      if (isBetOpen === false) {
        this.publicResponseMessage = "Generating new Bet Instance...";
        //console.log(this.#BetInstance); < this is a model
        this.#BetInstance = await this.#BetInstance.create({isOpen: 1});//.then(async function(resultModel) {
          console.log(this.#BetInstance); // < this *should* be an instance... but its a model
          // take the betID and look for corosponding pool, if not there create a new one:
          await this.#controllerBetPoolA.createNewPool(this.#BetInstance.betID);
          await this.#controllerBetPoolB.createNewPool(this.#BetInstance.betID);
          this.publicResponseMessage = `New Bet Number: ${this.#BetInstance.betID} has been Opened!`;
          return result = true;
        //});
      } else {
        this.publicResponseMessage = `old open Bet Number: ${this.#BetInstance.betID} has been found.`;
        return result = await this.getLastBet();
      }
    //});
  }

  /*
    Function that grabs the last created bet and assigns it to the controller.
  */
  async getLastBet() {
    console.log(this.#BetInstance);
    const lastBet = await this.#BetInstance.findOne({
      where: {},
      order: [['createdAt', 'DESC']],
    });
    console.log(`found last bet: ${lastBet}`);
    if (lastBet === null) {
      this.publicResponseMessage = "I'm a stupid bot and I can't find the bet!";
      return false;
    } else {
      this.#BetInstance = lastBet;
      this.publicResponseMessage = `Assigned Bet No.: ${this.#BetInstance.betID}`;
    }
    console.log(this.publicResponseMessage);
    return true;
  }

  /*
    Function that sets the current betInstance as active.
  */
  async openBet() {
    console.log(this.#BetInstance);
    let helper = this.#BetInstance;
  await this.#BetInstance.update({
        isOpen: true
      });
    this.#BetInstance = helper;
	this.publicResponseMessage = `Betting round #${helper.betID} is now open! Better get betting!`;
  }

  /*
    Function that closes the Bet
  */
  async closeBet() {
    let helper = this.#BetInstance;
    await this.#BetInstance.update({
        isOpen: 0
      });
	this.publicResponseMessage = `Betting round #${helper.betID} is now closed! No more bets will be accepted!`;
  }


  /*
    control function that shows if the assigned bet is open or closed. 
  */
  isOpen() {
    if (this.#BetInstance.isOpen === true) {
      return this.#BetInstance.isOpen;
    } else {
      this.publicResponseMessage = `Bet Number: ${this.#BetInstance.betID} is closed.`;
      return false;
    }
  }

  /*
    Put money on a Player if possible and take that money from the Users account.
    returns a Transaction Controller instance for user output.
  */
  async betOnPlayer(playerNumber, amount, userID ) {
    let betAmount = amount * -1; // negate so the money gets retracted from the player
    let targetPool;
    if (playerNumber === 1) {
      targetPool = this.#controllerBetPoolA;
    } else {
      targetPool = this.#controllerBetPoolB;
    }
    let result = await targetPool.betOnPlayer(userID, betAmount);
    return result;
  }


  /*
    internal Method that calculates and returns the Odds based on the fractional betpool system,
    described in "Saalty_Bet_Nights_1" document

    Assumes that all the Pots are larger than 0 else it will return 0 and set error 
    
    returns the calculated odds as a float value
  */
  #calculateOdds(sumPotA,sumPotB) {
    console.log(sumPotA,sumPotB)
    var odds = 0;
    if (sumPotA === 0 || sumPotB === 0) {
      return 0;
    }
    if(sumPotA > sumPotB) {
    odds = sumPotA/sumPotB;
    } else if(sumPotA < sumPotB) {
    odds = sumPotB/sumPotA;
    }
    return odds;
  }

  /*
    takes all the transactions of the winning pool and gives the winners their price money.
    playerNumber: The number of the winning player
    message: the original message object passed from the command. Used to output which user is being paid what.
    returns true on success, false on error
  */
  async payoutWinners(playerNumber) {
    // die on failure
    if (this.readyState = false) {
      this.publicResponseMessage = "Unable to payout Winners. Controller is not yet Ready.";
      return this.readyState;
    }

    
    let winningPool;
    this.#odds = this.#calculateOdds(
      this.#controllerBetPoolA.getPoolValue(), 
      this.#controllerBetPoolB.getPoolValue()
    );
    if (playerNumber === 1) {
      winningPool = this.#controllerBetPoolA;
    } else {
      winningPool = this.#controllerBetPoolB;
    }
    //( payout = initialput + (initialput * odds);)
    await winningPool.payoutWinners(this.#odds).then( async () => {
      this.publicResponseMessage = "Congratulations! a winner is you.";
      await this.closeBet().then( () => {
        return true;
      });
    });
    // give them a funny response to show that the payout process is completed.
  }

  
} // end controller :D

module.exports = betController;