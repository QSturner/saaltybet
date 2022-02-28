
/*
ShortDescription:
Controller for Generating, validating and Executing Transactions

This module provides a Interface to generate New Entries in the Transaction Table,
and have them interact with the specified user Profile.
Intended to be used to automate Betting Pool interaction and User Payouts.
On generation it validates the entries and returns a status code (valid transaction, or invalid transaction)
The "CommitTransaction" Functions will then commit the actual transaction and return the results over its members to the caller.
The Members of the object can then be used to output feedback to the user. The "Reset" Method will allow the caller to reuse the
class in a loop.

  @param {databaseContext}    Sequelizer Instance which will handle the Database I/O
  @param {transactionMode}    string containing the Origin of Transaction (used for special case handling and later reconciliation of transactions)
  @param {targetUserID}         string containing the UserID of the transaction target. (Discord ID or @Tag object.)
  @param {transactionAmount}  String containing Amount of Currency getting added/subtracted from target.

  @output {transactionMessage} String Array containing 2 text templates for the reply message.
  @output {transactionStatus} boolean, returning true if transaction succeeded and false on abort or error.
*/
class TransactionGenerator {

static ERRORINVALIDNUMBER = "Requested Amount Invalid. Please retype the command with a negative or positive number.";
static ERRORUSERNOTFOUND = "User's Saa-ltyBet account doesn't exist. Register the user first."
static ERRORIMPOSSIBLETRANSACTION = "An Error Occured. Please check your Input."
static ERRORNOOPENTRANSACTION = "No open Bet could be found. Make sure a bet is open, before placing bets!"

  //Private Members:
  #abortTransaction = false; // internal error indicator
  #transactionAmount = 0;
  #transactionType = ""; // the value that will get put into the Transaction Field "transactionType"
  #targetUserInstance;
  #databaseContext; // sequelizer instance.
  #betID = 0; // betID is defaulted. will be considered by the transactionMode, else its zero by default.
  //Public Members:
  transactionReply = ""; // Reply String that shows the Status of the Transaction.
  transactionMessages = ["",""]; // transaction Mode string, for the text templates in the command that implements this class.
  transactionStatus = true; // external error indicator

    constructor( databaseContext, transactionMode, targetUserID, transactionAmount ) {
      let Amount = parseInt(transactionAmount);

      // check if the provided information is plausible
      if ( (#validateNumber(transactionAmount) === true) && (this.#abortTransaction === false) ) {
        this.#transactionAmount = Amount;
        this.#targetUserInstance = #getTargetUserInstance(targetUserID);
        this.#transactionType = transactionMode;
        this.#betID = #getOpenBetID(transactionMode);
        this.transactionMessages = #defineTransactionMessage(transactionMode, Amount);
        //this.#message = message;
        this.#databaseContext = databaseContext;
        //this.transactionStatus = true; // should be set after actually commiting stuff
      } else {
        this.transactionStatus = false;
        console.log("ABORTING TRANSACTION Generation. Implausible Input.");
        return this.transactionStatus;
      };
    };

    /* tries to return the current open bet. if no bet is open, it will abort the transaction if the transactionType is non Admin or debug related.
      @param {transactionType}     the transactionType for current transaction
      @return {boolean}   will return true if the author of the message is in the defined group, or false if not.
    */
    #getOpenBetID(transactionMode) {
      if (transactionMode !== 'ADMIN') {
        let openBet = await #databaseContext.models['tblBets'].findOne("where: {isOpen: true,}");
        return openBet.betID;
      } else {
        this.transactionReply = ERRORNOOPENTRANSACTION;
        return 0;
      };
    };

  /*Get the Target User Instance from the Database. it will abort the Transaction if it cannot find the User.
      @param {DiscordID}     the transactionType for current transaction
      @return {null}         Function has no return, but will set the TransactionStatus to FALSE on failure.
  */
  #getTargetUserInstance(DiscordID) {
    targetUser = await this.#databaseContext.models['tblUserdata'].findOne(
      { where: { DiscordID: `${DiscordID}` } }
    );
    if (targetUser !== NULL ) {
      //this.transactionStatus = True;
      return targetUser;
    } else {
      this.transactionReply = ERRORUSERNOTFOUND;
      this.#abortTransaction = True;
    };
  }

    /* Helper Function that checks if inputNum is a valid number.
      @param {number}     the variable we wish to verify that it is actually a number.
      @return {boolean}   will return true if it is a number, or false if not.
    */
    #validateNumber(inputNum) {
      if (Number(inputNum) !== NaN && inputNum !== 0) {
        return true;
      } else {
        this.#abortTransaction = true;
        this.reply = ERRORINVALIDNUMBER
        return false;
      }
    };

    /* fills an array with transaction Codes, depending on the size of the input in relation to 0
    @params{number}: amount of money the user wishes to transfer. */
    #setBasicMessage(transactionAmount) {
      if (transactionAmount > 0) {
        return ["ADD", "added"];
      } else if (transactionAmount < 0) {
        return ["SUB", "subtracted"];
      }
    };

    /*alters Transactiontype comment to specify the type to be e.g "ADMIN-ADD or ADMIN-SUB"
        @params{string, Integer}: Label for Transaction and Amount of money the user wishes to transfer.
        @return{array[string, string] } 2d Array containing message blocks for a Bot reply message to the users.
    */
    #defineTransactionMessages(transactionType, transactionAmount) {
      let transTypeHelper = "";
      if (transactionAmount != 0) {
        let MessageHelper = #setBasicMessage(transactionAmount);
        transTypeHelper = MessageHelper[0] + "-" + transactionType;
        return [transTypeHelper, MessageHelper[1]];
      } else {
        return "ABORT";
      }
    };


  /* executes Transaction if possible and returns results
    assumes: construction went without issue. (all input validations are valid.)

    @return:{ boolean }  true on success, false on failure.
  */
   commitTransaction(){
     if (this.transactionStatus === true) {
        const addTransaction = await transactions.create({
        amount: this.#transactionAmount,
        userID: this.#targetUserInstance.DiscordID,
        transactionType: this.#transactionType,
        betID: this.#betID
        });
       console.log(`Transaction number ${addTransaction.transactionID} Commited.`);
       console.log(`Applying changes to User: ${this.#targetUserInstance.DiscordID}`);
       // update targetUser Instance.
       let oldMoney = this.#targetUserInstance.currentMoney

        // actually adding/subtracting money to user.
        #targetUserInstance.update({
          currentMoney: #targetUserInstance.currentMoney + this.#transactionAmount
        });

        // outputting result.
       let REPLYMSG = `${addTransaction.amount} has been ${transactionMessages[1]} to ${targetUserInstance.Name}'s balance.\nOld Balance: ${oldMoney}\nNew Balance: ${targetUserInstance.currentMoney}!`;

        console.log(REPLYMSG);
       this.transactionReply = REPLYMSG;
       return this.transactionStatus = true;

     } else {
       console.log("Aborting Transaction.");
       return this.transactionStatus;
     };
    };
};

module.exports = TransactionGenerator;
*/
