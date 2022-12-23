const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
const betController = require("../Database/Controllers/betController.js")

/* checks user role. used for command authority
  @param {message}     the original message object that called the command.
  @return {boolean}   will return true if the author of the message is in the defined group, or false if not.
*/
function checkForAdmin(message) {
	return message.member.roles.cache.has("937076188734693458")
};

module.exports = new Command({
	name: "closebets",
	description: "ADMIN command that closes the betting pool for the current match.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		let abortCondition = !checkForAdmin(message);
		const bets = new betController(databaseConnection);
		let lastBetFound = await bets.getLastBet();
		let isBetOpen = bets.isOpen();
		console.log(isBetOpen);
		console.log(bets);
		// the best way to avoid these nested ifs by running it all top down step by step
		// Like How often do you need to run this function when you can just run it all once?
		if (abortCondition) {
			//return DIE;
			return message.reply("You do not have access to this command, ok sss?")
		} else {
			if (isBetOpen == true) {
				message.channel.send("Closing bets. . .");
				await bets.closeBet();
				return message.channel.send(bets.publicResponseMessage);
			} else {
				return message.channel.send("Bets are already closed, Broh-");
			}
		}
	}
});