const Command = require("../structures/command.js");
const { Sequelize } = require('sequelize');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

/* checks user role. used for command authority
  @param {message}     the original message object that called the command.
  @return {boolean}   will return true if the author of the message is in the defined group, or false if not.
*/
function checkForAdmin(message) {
	return message.member.roles.cache.has("937076188734693458")
};

function processResult(args) {
	// TODO: Add logic for processing results
}

module.exports = new Command({
	name: "closebets",
	description: "ADMIN command that allows admins to tell the bot the winner of the match. Bot sends confirmation message and internally allocates money accordingly.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		// Todo: Implement controllers for transactions and betting pool
		if (checkForAdmin == true) {
			processResult(args);
			message.channel.send(`Fighter ${args[1]} wins! Funds have been allocated accordingly.`);
		} else {
			message.reply("You are not an admin, therefore you cannot use this command.");
		}
	}
});