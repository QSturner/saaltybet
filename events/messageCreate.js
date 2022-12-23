const Event = require("../structures/event.js");

module.exports = new Event("messageCreate", (client, message) => {
	if (!message.content.startsWith(client.prefix)) {
		return;
	}

	const args = message.content.substring(client.prefix.length).split(/ +/);

	const command = client.commands.find(cmd => cmd.name == args[0]);

	if (!command) {
		return message.reply(`"${args[0]}" is not a valid command.`)
	}

	const permission = message.member.permissions.has(command.permission)

	if (!permission) {
		return message.reply(`You do not have the permission to "${command.permission}", unable to run command.`);
	}

	command.run(message, args, client);
});