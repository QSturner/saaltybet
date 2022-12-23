const { SlashCommandBuilder } = require('discord.js');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

/**
 * Converts a user tag into an id
 * @param {string} inputString A.K.A. the raw tag
 * @return {string} The derived user id
 */
 function getDiscordIDFromTag(inputString) {
	let closeBracket = inputString.indexOf(">");
	return inputString.slice(3, closeBracket);
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('money')
        .setDescription('Displays the amount of Amehysst in the specified user\'s account')
        .addStringOption(option =>
            option.setName('username')
            .setDescription('The user you want to view the balance of')
            .setRequired(true)),
    async execute(interaction) {
        const userTagFormatted = getDiscordIDFromTag(interaction.options.getString('username'));
        const user = await userID.findOne({ where: { DiscordID: `${userTagFormatted}` } });

        if (user == null) {
            interaction.reply(`Invalid username, "${interaction.options.getString('username')}". Either username does not exist or user is not registered.`);
        } else {
            interaction.reply(`${user.Name} has ${interaction.client.emojis.cache.find(emoji => emoji.name === 'amehysst')}${user.currentMoney}`)
        }
    }
}