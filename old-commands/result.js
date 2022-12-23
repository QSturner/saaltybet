const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
const betController = require("../Database/Controllers/betController.js");

/* checks user role. used for command authority
  @param {message}     the original message object that called the command.
  @return {boolean}   will return true if the author of the message is in the defined group, or false if not.
*/
function checkForAdmin(message) {
	return message.member.roles.cache.has("937076188734693458")
};

function validateFighter(fighterNum) {
	return (fighterNum === 1 || fighterNum === 2);
}

module.exports = new Command({
	name: "result",
	description: "ADMIN command that allows admins to tell the bot the winner of the match. Bot sends confirmation message and internally allocates money accordingly. Will automatically close all bets.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		const fighterNumber = parseInt(args[1]);
		const bets = new betController(databaseConnection);
		let isBetOpen = await bets.getLastBet();
    	if (!isBetOpen) {
      		// DIE
      		return message.reply("NOT YET SNAKE! ITS NOT OVER YET! \n(You need to open a new Bet before closing a bet.)\nOk sss?");
    	} else {
        await bets.initBetSubControllers();
      }
		
		
		let isFighterValid = validateFighter(fighterNumber);
		const abortCondition = checkForAdmin(message);

		if (abortCondition !== true) {
			return message.reply("You do not have access to this command, ok sss?")
		} else {
			if (isFighterValid == true) {
				await bets.payoutWinners(fighterNumber);
				message.channel.send(`Fighter #${fighterNumber} wins! Funds have been allocated accordingly.`);
			} else {
        return message.channel.send(`Fighter #${fighterNumber} is not a valid Fighter Number, Baka. ssss...`);
      }
		}
	}
});