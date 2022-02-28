
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

  //Private Members:
  #abortTransaction = false; // internal error indicator
  #transactionAmount = 0;
  #transactionType = ""; // the value that will get put into the Transaction Field "transactionType"
  #targetUserInstance;
  #originalArguments = [];
  #databaseContext; // sequelizer instance.
  #betID = 0; // betID is defaulted. will be considered by the transactionMode, else its zero by default.
  //Public Members:
  transactionReply = ""; // Reply String that shows the Status of the Transaction.
  transactionMessages = ["",""]; // transaction Mode string, for the text templates in the command that implements this class.
  transactionStatus = true; // external error indicator

    constructor( databaseContext, transactionMode, targetUserID, transactionAmount ) {
      let transactionAmount = parseInt(transactionAmount);

      // check if the provided information is plausible
      if ( (#validateNumber(transactionAmount) === true) && (this.#abortTransaction === false) ) {
        this.#transactionAmount = transactionAmount;
        this.#targetUserInstance = #getTargetUserInstance(targetUserID);
        this.#transactionType = transactionMode;
        this.#betID = #getOpenBetID(transactionMode);
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
        this.transactionReply = ERRORUSERNOTFOUND;
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

    //alters Transactiontype comment to specify the type to be e.g "ADMIN-ADD or ADMIN-SUB"
    //No error handling, cause error handling is for pussies :P (srsly will need to add that later.)
    #defineTransactionType(transactionType, transactionAmount) {
      if (transactionAmount != 0) {
        return #setBasicMessage(transactionAmount)[0] + "-" + transactionType;
      } else {
        return "ABORT";
      }
    };



  /* executes Transaction if possible and returns results.
    the transactionMessages can be used to convey to the user the

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


     } else {
       console.log("Aborting Transaction.");
       return this.transactionStatus;
     }
    };

  #setTransactionStatus(){

  }
};

//module.exports = TransactionGenerator;

/* IGNORE PAST TIS POINT. I'm just storing old code for reference Will be Deleted as I progress.


  // Checks what type of transaction is being requested and if the amouint is not null
  if (validateNumber(transactionAmount) == true) {
    transactionMessages = setTransactionMessage(transactionAmount);
  } else { // abort on invalid number.
    return message.reply("Requested Amount Invalid. Please retype the command with a negative or posiive number.")
  };

  // Makes sure user entered exists in the database
  if (targetUserInstance === null) {
    return message.reply("User's Saa-ltyBet account doesn't exist. Register the user first.");
  };
  // creating new transaction.

  var oldMoney = targetUserInstance.currentMoney

  // actually adding/subtracting money to user.
  targetUserInstance.update({
    currentMoney: targetUserInstance.currentMoney + addTransaction.amount
  });

  // outputting result.
  console.log(`${addTransaction.amount} has been ${transactionMessages[1]} to ${targetUserInstance.Name}'s balance.\nOld Balance: ${oldMoney}\nNew Balance: ${targetUserInstance.currentMoney}!`);


*/
