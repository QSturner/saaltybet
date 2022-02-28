const Command = require("../structures/command.js");

module.exports = new Command({
	name: "echo",
	description: "Repeats whatever text is included.",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		let messageString = "";

		if (args.length === 1) {
			return;
		} else {
			for (var i = 1; i < args.length; i++) {
				messageString += args[i] + " ";
			}
			message.channel.send(messageString);
			message.delete();
		}
	}
});
/* 
How about this?

newargs = args.splice(1)
messagestring = newargs.join(" ")
 */