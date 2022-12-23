const { SlashCommandBuilder } = require('discord.js');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-money')
        .setDescription('Displays the amount of Amehysst currently in your possession'),
    async execute(interaction) {
        const user = await userID.findOne({ where: { DiscordID: `${interaction.user.id}` } });

        if (user == null) {
            await interaction.reply({ content: 'You are not registered. Please register using the `/register` command.', ephemeral: true });
        } else {
            await interaction.reply({ content: `Your current balance is ${interaction.client.emojis.cache.find(emoji => emoji.name === 'amehysst')}${user.currentMoney}`, ephemeral: true });
        }
    },
};