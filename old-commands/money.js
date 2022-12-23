const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

module.exports = new Command({
	name: "money",
	description: "Displays the amount of Amehysst in the specified user's account",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		let closeBracket = args[1].indexOf(">");
		const userTagFormatted = args[1].slice(3, closeBracket);
		const user = await userID.findOne({ where: { DiscordID: `${userTagFormatted}` } });

		if (user === null) {
			message.channel.send(`Invalid username, "${args[1]}". Either username does not exist or user is not registered.`)
		} else {
			message.channel.send(`${user.Name} has ${client.emojis.cache.find(emoji => emoji.name === 'amehysst')}${user.currentMoney}`);
		}
	}
});