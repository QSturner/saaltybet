const Discord = require("discord.js");

/**
 * @param {Discord.Message} message
 * @param {string[]} args
 * @param {Bot} bot
 */
function runFunction(message, args, client) {}

class Command {

	/**
	 * @typedef {{name: string, description: string, permission: Discord.PermissionString, run: runFunction}} CommandOptions
	 * @param {CommandOptions} options
	 */
	constructor(options) {
		this.name = options.name;
		this.description = options.description;
		this.permission = options.permission;
		this.run = options.run;
	}

}

module.exports = Command;