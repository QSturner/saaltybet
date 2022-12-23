const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ok-sss')
		.setDescription('Replies with Saa\'s signature "Ok sss"!'),
	async execute(interaction) {
		await interaction.reply('Ok sss 🐍');
	}
}