const { SlashCommandBuilder } = require('discord.js');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
const betController = require("../Database/Controllers/betController.js");

/**
 * Checks user role. used for command authority
 * @param {BaseInteraction} interaction The original interaction object that called the command
 * @return {boolean} Will return true if the author of the message is in the defined group, or false if not.
*/
function checkForAdmin(interaction) {
	return interaction.member.roles.cache.has('937076188734693458');
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('get-result')
        .setDescription('ADMIN command that gets the result of the current round and allocates winnings and losses')
        .addIntegerOption(option =>
            option.setName('fighter')
            .setDescription('The fighter that won the round')
            .setRequired(true)
            .addChoices(
                { name: 'Fighter 1', value: 1 },
                { name: 'Fighter 2', value: 2 },
            )),
    async execute(interaction) {
        const winningFighter = interaction.options.getInteger('fighter');
        const bets = new betController(databaseConnection);
		let isBetOpen = await bets.getLastBet();
    	if (!isBetOpen) {
      		// DIE
      		return await interaction.reply("NOT YET SNAKE! ITS NOT OVER YET! \n(You need to open a new Bet before closing a bet.)\nOk sss?");
    	} else {
            await bets.initBetSubControllers();
        }

		const abortCondition = checkForAdmin(interaction);

		if (abortCondition !== true) {
			return await interaction.reply('You do not have access to this command, ok sss?');
		} else {
            await bets.payoutWinners(fighterNumber);
            return await interaction.reply(`Fighter #${fighterNumber} wins! Funds have been allocated accordingly.`);
		}
    },
};