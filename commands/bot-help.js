const Discord = require("discord.js");
const Command = require("../structures/command.js");

module.exports = new Command({
	name: "bot-help",
	description: "Displays a list of the available commands, how to use them, and their function.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		const embed = new Discord.MessageEmbed();

		embed.setTitle("Saa-lty Bet Bot Help")
		.setColor("#D35FFF")
		.setDescription("Disclaimer: This list is subject to change.")
		.addField("Commands", "**$bet [fighterNumber] [amountInAmehysst]** - Lets the user place a bet into the betting pool of the fighter of their choosing. Bot checks if possible, else replies with an error message. If possible, Bot replies with a confirmation message.\n");

		message.channel.send({ embeds: [embed] });
	}
});