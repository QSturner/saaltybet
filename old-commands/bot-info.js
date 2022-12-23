const Discord = require("discord.js");
const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize');
//const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

module.exports = new Command({
	name: "bot-info",
	description: "Displays information about the bot.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		const embed = new Discord.MessageEmbed();

		embed.setTitle("Saa-ltyBet Bot")
		.setDescription("A bot that plays a modified version of SaltyBet. Intended only for use in the 'Saa's Bed of Snakes' Discord Server.")
		.setColor("#D35FFF")
		.setThumbnail(client.user.avatarURL({ dynamic: true }))
		.addField("Bot Version", "1.0.0")
		.addField("Bot Developed by", "[QDynamic](https://github.com/QSturner) & [MadZee](https://github.com/Matzenino)")
		.setTimestamp(message.createdTimestamp)

		message.channel.send({ embeds: [embed] });
	}
});