const Discord = require("discord.js");
const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

/*
	Command pseudocode:
		* initalize constant variable set to a query getting ALL users currently in both of the current betting pools
`		* for ALL users in each betting pool
			
*/

module.exports = new Command({
	name: "cancelround",
	description: "ADMIN command that cancels the current round and returns money to all participants.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		
	}
});