const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
/*
console.log("databaseConnection: ", databaseConnection);
console.log("####");
console.log("userID: ", userID);
*/
module.exports = new Command({
	name: "register",
	description: "Registers the user into the database",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		const database = await userID.findByPk(message.author.id); 
		if (database === null) {
			const user = await userID.create({ DiscordID: `${message.author.id}`, Name: `${args[1]}`, username: `${message.author.username}` });
			message.channel.send(`Welcome, ${user.Name} to Saa-ltyBet!\nYour current Amehysst balance is <:amehysst:939333676225945680> ${user.currentMoney}`);
		} else {
  			message.reply("You are already registered!")
		}
	}
});