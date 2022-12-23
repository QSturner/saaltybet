const Command = require("../structures/command.js");
//const { Sequelize } = require('sequelize');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
const betController = require("../Database/Controllers/betController.js");
//const betPoolController = require("../Database/Controllers/betPoolController.js")

function handleFighterArg(fighterArg) {
  // no Player would ever understand why Fighter 1 is Fighter 0. hence why you gotta expect them to use 1 and 2.
  // the bet Controller accounts for this.
  return (fighterArg == 1 || fighterArg == 2);
}

function validateBetAmount(betAmount) {
  return (betAmount >= 0);
}

function validateUser(userQuery) {
  if (userQuery === null) {
    return false;
  } else {
    return true;
  }
}

/*
Helper Method that validates the fail conditions and returns proper errorcode.
returns string if error is found or a false if error is not found.
*/
function crashGracefully(fighterArg, betAmount, user, hasBet, isBetsOpen, hasSufficientMoney) {
  const ERRORWRONGFIGHTER = `There is no Fighter #${fighterArg}!\nOnly Fighter #1 and #2 are possible.`;
  const ERRORINVALIDAMOUNT = "Bet amount is invalid. Enter a number greater than zero.";
  const ERRORNOUSERFOUND = "You cannot place a bet because you are not registered! Register using the $register command.";
  const ERRORBETSCLOSED = "You cannot place a bet! Bets are currently closed.";
  const ERRORNOBETS = "Impossible to Bet on a non existing Bet ;)";
  const ERRORINSUFFICIENTFUNDS = "You do not have enough to bet that amount!";
  let errorcode = false;

  switch (true) {
    case !handleFighterArg(fighterArg):
      errorcode = ERRORWRONGFIGHTER;
      break;
    case !validateBetAmount(betAmount):
      errorcode = ERRORINVALIDAMOUNT;
      break;
    case !validateUser(user):
      errorcode = ERRORNOUSERFOUND;
      break;
    case !isBetsOpen:
      errorcode = ERRORBETSCLOSED;
      break;
    case !hasBet:
      errorcode = ERRORNOBETS;
      break;
	case !hasSufficientMoney:
	  errorcode = ERRORINSUFFICIENTFUNDS;
	  break;
  }
  return errorcode;
}

module.exports = new Command({
  name: "bet",
  description: "Allows the user to bet their money on a fighter if the betting pool is open.\nUsage: $bet fighterNumber Amount f.E.: $bet 1 500",
  permission: "SEND_MESSAGES",

  async run(message, args, client) {
    const fighterArg = parseInt(args[1]);
    const betAmount = parseInt(args[2]);
    const user = await userID.findOne({ where: { DiscordID: `${message.author.id}` } });

    const betInstance = new betController(databaseConnection);
    let hasBet = await betInstance.getLastBet();
    let isBetsOpen = betInstance.isOpen();
	  let hasSufficientFunds = (user.currentMoney > 0 && user.currentMoney >= betAmount)

    const abortCondition = crashGracefully(fighterArg, betAmount, user, hasBet, isBetsOpen, hasSufficientFunds);
    if (abortCondition != false) {
      return message.reply(abortCondition);
    }

    
    await betInstance.initBetSubControllers().then(async ()=>{
    if (!hasBet || !betInstance.isInitialized || !betInstance.readyState) {
      return message.reply(betInstance.publicResponseMessage + "\nUnable to place Bet :(");
    } else {
      let result = await betInstance.betOnPlayer(fighterArg, betAmount, user.DiscordID);
      return message.reply(`Bet on Fighter #${fighterArg} for  ${client.emojis.cache.find(emoji => emoji.name === 'amehysst')}${betAmount} has been made and added to the pool!`);
    }
    });

  }
});