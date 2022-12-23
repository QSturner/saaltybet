const { SlashCommandBuilder } = require("discord.js");
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

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
        .setName('cancel-round')
        .setDescription('ADMIN command that cancels the current round'),
    async execute(interaction) {
        if (!checkForAdmin(interaction)) {
            // Return DIE
            return await interaction.reply('You do not have access to this command, ok sss?')
        } else {
            await interaction.reply('Canceling round. . .');
        }
    }
};