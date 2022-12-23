const { SlashCommandBuilder } = require('discord.js');
const { bets, bettingPools, userID, transactions, databaseConnection } = require('../Database/db.js');
const betController = require('../Database/Controllers/betController.js');

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
        .setName('close-bets')
        .setDescription('ADMIN command that closes the betting pool for the current match.'),
    async execute(interaction) {
        let abortCondition = !checkForAdmin(message);
		const bets = new betController(databaseConnection);
		let lastBetFound = await bets.getLastBet();
		let isBetOpen = bets.isOpen();
		console.log(isBetOpen);
		console.log(bets);
		// the best way to avoid these nested ifs by running it all top down step by step
		// Like How often do you need to run this function when you can just run it all once?
		if (abortCondition) {
			//return DIE;
			return await interaction.reply('You do not have access to this command, ok sss?');
		} else {
			if (isBetOpen == true) {
				await interaction.reply('Closing bets. . .');
				await bets.closeBet();
				return await interaction.followUp(bets.publicResponseMessage);
			} else {
				return await interaction.reply('Bets are already closed, Broh-');
			}
		}
    },
};