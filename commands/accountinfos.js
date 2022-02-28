/* const Command = require("../structures/command.js");
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

module.exports = {new Command({
	name: "showMone",
	description: "Tells the user his currently owned mone",
	permission: "SEND_MESSAGES",

	async run(message, args, client) {
		const database = await userID.findByPk(message.author.id); 
		if (database != null) {
			const user = await userID.create({ DiscordID: `${message.author.id}`, Name: `${args[1]}`, username: `${message.author.username}` });
			message.channel.send(`Welcome, ${user.Name} to Saa-ltyBet!\nYour current Amehysst balance is ${user.currentMoney}`);    
		} else {
  			message.reply("You are not registered! You aint got no mone.")
		}
	}
}), /*new Command({ // appearantly I can just add more and more stuff this way.
	name: "currentBets",
	description: "Tells the user if theres a bet open at the moment",
	permission: "SEND_MESSAGES",
*/
//} */