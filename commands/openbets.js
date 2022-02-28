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

function handleArgument(args) {
	if (args[1] === "new") {
		return "Opening new betting pool!";
	} 
	else if (args[1] == undefined) {
		return "Opening current betting pool!";
	} else {
		return 'Invalid argument. Use the "new" argument to open a new betting pool.';
	}
}

module.exports = new Command({
	name: "openbets",
	description: "ADMIN command that opens the betting pool for the current match or a new match (specified by the optional 'new' parameter).",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		// Todo: Implement controllers for transactions and betting pool
		if (checkForAdmin(message) == true) {
			message.channel.send(handleArgument(args));
		} else {
			message.reply("You do not have access to this command.")
		}
	}
});