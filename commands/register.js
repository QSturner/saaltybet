const { SlashCommandBuilder } = require('discord.js');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('register')
        .setDescription('Registers you into the Saa-ltyBet system')
        .addStringOption(option =>
            option.setName('name')
            .setDescription('Your name')
            .setRequired(true)),
    async execute(interaction) {
        const database = await userID.findByPk(interaction.user.id);
        const userName = interaction.options.getString('name');

		if (database === null) {
			const user = await userID.create({ 
                DiscordID: `${interaction.user.id}`,
                Name: `${userName}`,
                username: `${interaction.user.username}`
            });
			await interaction.reply({ content: `Welcome, ${user.Name} to Saa-ltyBet!\nYour current Amehysst balance is ${user.getAmehysstEmoji(interaction)}${user.currentMoney}`, ephemeral: true });
		} else {
  			await interaction.reply({ content: 'You are already registered!', ephemeral: true });
		}
    },
};