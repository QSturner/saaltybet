const Discord = require("discord.js");
const prefix = "$";
const Command = require("./command.js");
const Event = require("./event.js");
const { GatewayIntentBits } = require('discord.js');
const fs = require("fs");

class Client extends Discord.Client {
  
	constructor() {
		super({ intents: [GatewayIntentBits.Guilds] });

		/**
		 * @type {Discord.Collection<string, Command>}
		 */
		//this.commands = new Discord.Collection();

		this.prefix = prefix
	}

	start(token) {
		/* fs.readdirSync("commands").filter(file => file.endsWith(".js")).forEach(file => {
			/**
			 * @type {Command}
			**\/
			const command = require(`../old-commands/${file}`);
			console.log(`Command "${command.name}" loaded`)
			this.commands.set(command.data.name, command);
		});  */

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