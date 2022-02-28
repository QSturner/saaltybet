const Command = require("../structures/command.js");
const { Sequelize } = require('sequelize');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
//const {transactionController} = require("../Database/Controllers/generateTransaction.js")
//const newTransaction = require("../Database/Controllers/generateTransaction.js")

/* checks user role. used for command authority
  @param {message}     the original message object that called the command.
  @return {boolean}   will return true if the author of the message is in the defined group, or false if not.
*/
function checkForAdmin(message) {
return message.member.roles.cache.has("937076188734693458")
};

/* checks if inputNum is a valid number. 
  @param {number}     the variable we wish to verify that it is actually a number.
  @return {boolean}   will return true if it is a number, or false if not.
*/
function validateNumber(inputNum) {
	if (Number(inputNum) !== NaN && inputNum !== 0 ) {
    return true;
  } else {
    return false;
  }
};

/* fills an array with transaction Codes, depending on the size of the input in relation to 0
 @todo: refactor into the transaction model as part of the setter and getter method, in order to automate the process.
 @params{number}: amount of money the user wishes to transfer. */
function setTransactionMessage(transactionAmount) {
	if (transactionAmount > 0) {
		return ["Admin-ADD","added"];
	} else if (transactionAmount < 0) {
		return ["Admin-SUB","subtracted"];
	}
};

module.exports = new Command({
	name: "tellerTest",
	description: "Testbed for the new Controller System",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
// assign args to temp variables for pre evaluation (and debugging)
var command = args[0];
var targetUser = args[1];
var transactionAmount = parseInt(args[2]);
var transactionMessages = ["",""];

		// Checks to see if command sender is in admin guild
		if (checkForAdmin(message) == false) { // todo, refactor check as function, because we will need this a bunch more.
				return message.reply("You do not have access to this command.");
			};
			// Checks what type of transaction is being requested and if the amouint is not null
			if (validateNumber(transactionAmount) == true) {
				transactionMessages = setTransactionMessage(transactionAmount);
			} else { // abort on invalid number.				
				return message.reply("Requested Amount Invalid. Please retype the command with a negative or posiive number.")
			};
			const targetUserInstance = await userID.findOne({ where: { Name: `${targetUser}` } });
			// Makes sure user entered exists in the database
			if (targetUserInstance === null) {
				return message.reply("User's Saa-ltyBet account doesn't exist. Register the user first.");
			};
          // creating new transaction.
          //newTransaction.create(xxxx)
					const addTransaction = await transactions.create({ amount: parseInt(transactionAmount), userID: `${targetUserInstance.DiscordID}`, transactionType: transactionMessages[0] });
					var oldMoney = targetUserInstance.currentMoney

					// actually adding/subtracting money to user.
					targetUserInstance.update({
						currentMoney: targetUserInstance.currentMoney + addTransaction.amount
					});
					
          // outputting result.
					message.channel.send(`${client.emojis.cache.find(emoji => emoji.name === 'amehysst')}${addTransaction.amount} has been ${transactionMessages[1]} to ${targetUserInstance.Name}'s balance.\nOld Balance: ${oldMoney}\nNew Balance: ${targetUserInstance.currentMoney}!`);
		}
});