const Discord = require("discord.js");
const prefix = "$";
const Command = require("command.js");
const Event = require("./event.js");
const intents = new Discord.Intents(32767);
const fs = require("fs");

class Client extends Discord.Client {
  
	constructor() {
		super({ intents });

		/**
		 * @type {Discord.Collection<string, Command>}
		 */
		this.commands = new Discord.Collection();

		this.prefix = prefix
	}

	start(token) {
		fs.readdirSync("commands").filter(file => file.endsWith(".js")).forEach(file => {
			/**
			 * @type {Command}
			*/
			const command = require(`../commands/${file}`);
			console.log(`Command "${command.name}" loaded`)
			this.commands.set(command.name, command);
		});

		fs.readdirSync("events").filter(file => file.endsWith(".js")).forEach(file => {
			/**
			 * @type {Event}
			 */
			const event = require(`../events/${file}`);
			console.log(`Event "${event.event}" loaded`)
			this.on(event.event, event.run.bind(null, this))
		});

		this.login(token)
	}

}

module.exports = Client;