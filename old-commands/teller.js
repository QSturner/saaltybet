const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
const transaction = require("../Database/Controllers/generateTransaction.js")
const { Op } = require('@sequelize/core')

/* determines the type of transaction and creates a new transaction using the generateTransactions controller
	@param
*/
async function generateTransaction(targetUserID, transactionAmount) {
	const t1 = new transaction(databaseConnection, "ADMIN", targetUserID, transactionAmount);
  await t1.init().then(
    async function(value) {
      await t1.commitTransaction();
    });
	return t1;
}

/*
  takes a @User Discord thingy and turns it into a DiscordID.
*/
function getDiscordIDFromTag(inputString) {
	let closeBracket = inputString.indexOf(">");
	return inputString.slice(3, closeBracket);
}

module.exports = new Command({
	name: "teller",
	description: "ADMIN command that lets any admin subtract or add currency to participants' balances.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
    let targetUserInstance;
		// assign args to temp variables for pre evaluation (and debugging)
		var command = args[0];
		var targetUser = args[1];
		var transactionAmount = parseInt(args[2]);
		var queryString = ``;
		let targetUserID = getDiscordIDFromTag(targetUser);

		const findUserQuery = await userID.findAll({ 
			where: { 
				[Op.or]: [{ Name: `${targetUser}` }, { DiscordID: `${targetUserID}` }]
			} 
		});
		// Querying database for entered user
		if (findUserQuery !== null && targetUser.substring(0, 3) === "<@!") {
      		console.log("Case A: TAG");
			targetUserInstance = await userID.findOne({where: { DiscordID: `${targetUserID}` } });
		} else {
      		console.log("Case B: Username");
			targetUserInstance = await userID.findOne({where: { Name: `${args[1]}` } });
		}

		// Checks to see if command sender is in admin guild
		if (targetUserInstance !== null && targetUserInstance.isAdmin(message) == false) {
			return message.reply("You do not have access to this command, ok sss?");
		}
    	
		// Makes sure user entered exists in the database
		if (targetUserInstance === null) {
			return message.reply("User's Saa-ltyBet account doesn't exist. Register the user first.");
		} else {
			// creating new transaction.
			const createdTransaction = await generateTransaction(targetUserInstance.DiscordID, transactionAmount);
        	// outputting result.
			message.channel.send(`${createdTransaction.transactionReply}`);
		}
	}
});