/*
This class provides an interface for all possible interactions with a Bet Pool.
It gets implemented exclusively by the Bet controller (1 Bet to 2 Bet Pools)

Idea is that the bet commands implement this controller and only access its functions to retrieve and alter the State of the Database.

bet class overview:
  +-> bet DBModel instance
  ++-> PoolController instance Fighter A
   +--> Transactions for Fighter A [...]
  ++-> PoolController instance Fighter B
   +--> Transactions for Fighter B [...]

  BetPool fields
  runningBetID
  bettingpool
  fighterNo
*/

/* things we need:
- query for all transactions with the currentBetID and the current fighter
*/
const transaction = require("../Controllers/generateTransaction.js");


class betPoolController {
  //Static Members
  //Public Members & Getters
  isReady = false;
  getPoolValue() {
    return this.#poolValue;
  }

  /*
    getter for the value in the pot, as a positive number
    returns the poolValue on completion. will return 0 if no transactions for it are found.
  */
  async calculatePoolValue() { //get sum of all things in the thing again :D
    if (this.#poolTransInstance.length === 0) {
      console.log(this.poolTransInstance);
      this.#poolValue = 0;
      await this.#betPoolInstance.save();
      return this.#poolValue;
    }
    console.log(this.#poolTransactions); // what the resulting query is supposed to look like:
    // SELECT SUM('amount') FROM 'tblTransactions' WHERE transactionType LIKE `PUT ${this.#fighterNumber} AND betID = BetID,`,
    console.log(this.poolTransInstance); // dafuq why is data in the transaction Model?????
    //'await User.sum('age')'
    let collectedPool = await this.#poolTransactions.sum('amount');
    console.log("calculatedPoolValue:", collectedPool);
    if (collectedPool < 0) {
      collectedPool = collectedPool * -1;
    }
	console.log("betPoolInstance below:")
	console.log(this.betPoolInstance);
    console.log(`PoolID: ${this.betPoolInstance.runningBetID} - calculated Pool: ${collectedPool}`)
    this.#poolValue = collectedPool;
    this.#betPoolInstance.bettingpool = collectedPool;
    await this.#betPoolInstance.save();
    return this.#poolValue;
  }
  
  //Private Members
  #databaseContext;
  #fighterNumber = 0;
  #betPoolModel;
  #betPoolInstance;
  #poolTransactions;
  #poolTransInstance;
  //#playerModelReference; 
  #poolValue = 0; // the sum of all transactions belonging to the player
  #transactionController;

  constructor(databaseContext, fighterNumber) {
    this.#fighterNumber = fighterNumber;
    this.#databaseContext = databaseContext;
    this.#betPoolModel = this.#databaseContext.models['tblPoolBet']; // Sequelize Model instance of the tblPoolBet entry
    this.#poolTransactions = this.#databaseContext.models['tblTransaction']; // Sequelize Model instance containing all the transactions belonging to this BetPool
  }

  /*
    method that generates a transaction for the user. It will take the amount away from the player and add it to the Pool
    to be called from betController.betOnPlayer(UserID,amount,playerNumber)
    returns the TransactionController for user Output (so he knows what happened to his mone.)
  */
  async betOnPlayer(UserID, amount) {
    let TransactionCode = `PUT ${this.#fighterNumber}`;
    this.#transactionController = new transaction(this.#databaseContext, TransactionCode, UserID, amount);
    const refTransController = this.#transactionController;
    if (this.#transactionController.transactionStatus === false) {
      // crash and burn :D
      return refTransController;
    } else {
      await refTransController.init().then(
        async () => {
          await refTransController.commitTransaction();
        });
      return this.#transactionController = refTransController;
    }
  }


  /*
    Method that generates a new BetPool based on the fighterNumber and stuff.
  */
  async createNewPool(BetID) {
    this.#betPoolInstance = await this.#betPoolModel.create({
      runningBetID: BetID,
      fighterNo: this.#fighterNumber,
    });
    console.log(this.#betPoolModel);
    this.isReady = true;
  }

  /*
    get the pool instance for the BetID if it exists
  */
  async retrievePoolInstance(BetID) {
    this.#betPoolInstance = await this.#betPoolModel.findOne({
      where: {
        runningBetID: BetID,
        fighterNo: this.#fighterNumber,
      }
    });
    //check if the retrieval was successful or not.
    this.isReady = true;
  }

  /*
    Find all Transactions with the proper Identifier in table 'tblTransaction'
    Assigns the instance to poolTransInstance and porceeds to calculate the pool values on success, 
else it returns  false.
  */
  async findAssignedBets(BetID) {
    let transactionsModelref = this.#databaseContext.models['tblTransaction'];
    console.log(transactionsModelref);
    //this.#poolTransInstance = await this.#poolTransactions.findAll({
    this.#poolTransInstance = await transactionsModelref.findAll({
      where: {
        transactionType: `PUT ${this.#fighterNumber}`,
        betID: BetID,
      }
    });

    console.log(`findAssignedBets()->#poolTransInstance:\n${JSON.stringify(this.#poolTransInstance, null, 2)}`);
    await this.calculatePoolValue();

  }

  /*
    If this is called, it will pay out all the players inside this betPool with their initial bet + their bet * the odds
  */
  async payoutWinners(odds) {
    let winnings;
    this.#poolTransInstance.forEach(async (result) => {
      //for each Transaction do the calculation
      if (odds > 0) {
        winnings = result.amount * odds;
      } else {
        winnings = result.amount;
      };
      console.log(`Calculated Winnings: ${winnings}\nOdds: ${odds}`);
      if (winnings < 0) {
        winnings = winnings * -1;
        result = await this.#addWinToUser(winnings, result.userID);
        return result;
      }
    })
  }

  /*
    Method that generates a transaction to each player in the array #poolTransactions
    will either pay out their initial put or their winnings.
  */
  async #addWinToUser(amount, userID) {
    let TransactionCode = "PAYOUT";
    this.#transactionController = new transaction(this.#databaseContext, TransactionCode, userID, amount);
    if (this.#transactionController.transactionStatus === false) {
      // crash and burn :D
      return this.#transactionController;
    } else {
      await this.#transactionController.init().then(
        async () => {
          console.log(this.#betPoolInstance);
          console.log(`#addWinToUser for Fighter: ${this.#fighterNumber} on BetID:${this.#betPoolInstance.id}`)
          this.#transactionController.setBetID(this.#betPoolInstance);
          await this.#transactionController.commitTransaction();
        });
    }
    return this.#transactionController;
  }


}
module.exports = betPoolController;