const {SlashCommandBuilder} = require('discord.js');
const { bets, bettingPools, userID, transactions, databaseConnection } = require('../Database/db.js');
const betController = require('../Database/Controllers/betController.js');
const bet = require('../old-commands/bet.js');

/**
 * Checks to see if the user is registered into the bot's database or not
 * @param {object} userQuery The query that is created by this command 
 * @returns {boolean} Returns true if user is not found, returns false otherwise
 */
function validateUser(userQuery) {
    if (userQuery === null) {
      return false;
    } else {
      return true;
    }
}

/**
 * Converts a user tag into an id
 * @param {string} inputString A.K.A. the raw tag
 * @return {string} The derived user id
 */
/*function getDiscordIDFromTag(inputString) {
	let closeBracket = inputString.indexOf(">");
	return inputString.slice(3, closeBracket);
}*/

/*
Helper Method that validates the fail conditions and returns proper errorcode.
returns string if error is found or a false if error is not found.
*/
function crashGracefully(user, hasBet, areBetsOpen, hasSufficientMoney) {
    const ERRORNOUSERFOUND = "You cannot place a bet because you are not registered! Register using the $register command.";
    const ERRORBETSCLOSED = "You cannot place a bet! Bets are currently closed.";
    const ERRORNOBETS = "Impossible to Bet on a non existing Bet ;)";
    const ERRORINSUFFICIENTFUNDS = "You do not have enough to bet that amount!";
    let errorcode = false;
  
    switch (true) {
      case !validateUser(user):
        errorcode = ERRORNOUSERFOUND;
        break;
      case !areBetsOpen:
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

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bet')
        .setDescription('Allows you to bet a specified amount on the selected fighter')
        .addIntegerOption(option => 
            option.setName('fighter')
                .setDescription('The number of the fighter you want to bet on')
                .setRequired(true)
                .addChoices(
                    { name: 'fighter 1', value: 1 },
                    { name: 'fighter 2', value: 2 },
                ))
        .addIntegerOption(option =>
            option.setName('amount')
            .setDescription('The amount of Amehyssts to bet')
            .setRequired(true)
            .setMinValue(25)),
    async execute(interaction) {
        //const userTagFormatted = getDiscordIDFromTag(interaction.options.getString('username'));
        const user = await userID.findOne({ where: { DiscordID: `${interaction.user.id}` } });

        const betInstance = new betController(databaseConnection);
        let hasBet = await betInstance.getLastBet();
        let areBetsOpen = betInstance.isOpen();
        let hasSufficientFunds = (user.currentMoney > 0 && user.currentMoney >= interaction.options.getInteger('bet'));

        const abortCondition = crashGracefully(user, hasBet, areBetsOpen, hasSufficientFunds);
        if (abortCondition != false) {
            return message.reply(abortCondition);
        }

        await betInstance.initBetSubControllers().then(async () => {
            if (!hasBet || !betInstance.isInitialized || !betInstance.readyState) {
              return message.reply(betInstance.publicResponseMessage + "\nUnable to place Bet :(");
            } else {
              let result = await betInstance.betOnPlayer(fighterArg, betAmount, user.DiscordID);
              return message.reply(`Bet on Fighter #${fighterArg} for  ${client.emojis.cache.find(emoji => emoji.name === 'amehysst')}${betAmount} has been made and added to the pool!`);
            }
        })
    },
};