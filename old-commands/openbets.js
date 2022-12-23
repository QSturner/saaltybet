const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize'); // disabled to avoid confusion (multiple instances accessing db can cause issues)
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
const betController = require("../Database/Controllers/betController.js")

/* checks user role. used for command authority
  @param {message}     the original message object that called the command.
  @return {boolean}   will return true if the author of the message is in the defined group, or false if not.
*/
function checkForAdmin(message) {
	return message.member.roles.cache.has("937076188734693458");
}

function handleArgument(args) {
	if (args[1] === "new") {
		return "Opening new betting pool. . .";
	} 
	else if (args[1] == undefined) {
		return "Opening current betting pool!";
	} else {
		return 'Invalid argument. Use the "new" argument to open a new betting pool.';
	}
}

module.exports = new Command({
	name: "openbets",
	description: "ADMIN command that opens the betting pool for the current match or a new match (specified by the optional 'new' parameter).",
	permission: "SEND_MESSAGES",
	
	async run(message, args, client) {
    	let abortCondition = !checkForAdmin(message);
  		let optionalNewArg = args[1];
  		let bets = new betController(databaseConnection);
      	let lastBetFound =	await bets.getLastBet();   
  		let isBetOpen = bets.isOpen();
  
      if (abortCondition) {
        //return DIE;
  		return message.reply("You do not have access to this command, ok sss?")
      } else {
  		if (isBetOpen == false && optionalNewArg === "new") {
  			message.channel.send(handleArgument(args));
			bets = new betController(databaseConnection)
  			await bets.newBet() // new bets are auto open
  			return message.channel.send(bets.publicResponseMessage);
  		} else if (isBetOpen == false && optionalNewArg === undefined && lastBetFound === true) {
  			message.channel.send(handleArgument(args));
  			await bets.openBet();
			  return message.channel.send(bets.publicResponseMessage);
  		} else if (lastBetFound === false) {
        		console.log(bets);
        		abortCondition = true;
        		return message.channel.send(bets.publicResponseMessage); // die on none found?
      	} else {
  			return message.channel.send("Bets are already open, Broh~");
  		}
  	}
  }
});