const Command = require("../structures/command.js");

module.exports = new Command({
	name: "ok-sss",
	description: "Says Saa's signature \"Ok sss\"!",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		message.reply("Ok sss 🐍")
	}
});