const Command = require("../structures/command.js");
const { Sequelize } = require('sequelize');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

module.exports = new Command({
	name: "bet",
	description: "Allows the user to bet their money on a fighter if the betting pool is open.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		message.channel.send("In development!");
	}
});