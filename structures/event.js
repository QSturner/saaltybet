const Discord = require("discord.js");
const Client = require("./client.js")

/**
 * @template {keyOf Discord.ClientEvents} K
 * @param {Client} client
 * @param {Discord.ClientEvents[K]} eventArgs
 */
function runFunction(client, ...eventArgs) {}

/**
 * @template {keyOf Discord.ClientEvents} K
 */
class Event {

	/**
	 * 
	 * @param {K} event
	 * @param {RunFunction<K>} runFunction
	 */
	constructor(event, runFunction) {
		this.event = event;
		this.run = runFunction;
	}

}

module.exports = Event;