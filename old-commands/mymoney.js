const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

module.exports = new Command({
	name: "mymoney",
	description: "Displays the amount of Amehysst currently in the sender's possession",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		const user = await userID.findOne({ where: { DiscordID: `${message.author.id}` } });

		if (user === null) {
			message.reply("You are not registered. Please register using the `$register` command.")
		} else {
			message.channel.send(`Your current balance is  ${client.emojis.cache.find(emoji => emoji.name === 'amehysst')}${user.currentMoney}`);
		}
	}
});