const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Displays information about the bot.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle('Saa-ltyBet Bot')
            .setDescription('A bot that plays a modified version of SaltyBet. Intended only for use in the "Saa\'s Bed of Snakes" Discord Server.')
            .setColor(0xD35FFF)
            .setThumbnail(interaction.client.user.avatarURL({ dynamic: true }))
            .addFields(
                { name: 'Bot Version', value: '1.0.0' },
                { name: 'Bot Developed by', value: '[QDynamic](https://github.com/QSturner) & [MadZee](https://github.com/Matzenino)' },
            )
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    },
};