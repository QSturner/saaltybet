const { SlashCommandBuilder } = require('discord.js');
const { bets, bettingPools, userID, transactions, databaseConnection } = require('../Database/db.js');
const betController = require('../Database/Controllers/betController.js');

/**
 * Checks user role. used for command authority
 * @param {BaseCommandInteraction} interaction The original interaction object that called the command
 * @return {boolean} Will return true if the author of the message is in the defined group, or false if not.
*/
function checkForAdmin(interaction) {
	return interaction.member.roles.cache.has('937076188734693458');
}

/**
 * Handles the string option passed in to the command
 * @param {Discord.BaseCommandInteraction} interaction The original interaction object that called the command
 * @return {string} The message that the bot will reply with
 */
function handleArgument(interaction) {
    const newOption = interaction.options.getString('new');

	if (newOption === 'new') {
		return 'Opening new betting pool. . .';
	} 
	else if (newOption == undefined) {
		return 'Opening current betting pool!';
	} else {
		return 'Invalid argument. Use the "new" option to open a new betting pool.';
	}
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('open-bets')
        .setDescription('ADMIN command that opens the betting pool for the current match or a new match.')
        .addStringOption(option =>
            option.setName('new')
            .setDescription('Type "new" if you want to open bets for a new round')
            .setRequired(false)),
    async execute(interaction) {
        let abortCondition = !checkForAdmin(interaction);
  		let optionalNewArg = interaction.options.getString('new');
  		let bets = new betController(databaseConnection);
      	let lastBetFound = await bets.getLastBet();   
  		let isBetOpen = bets.isOpen();

        if (abortCondition) {
            //return DIE;
            await interaction.reply('You do not have access to this command, ok sss?');
        } else {
            if (isBetOpen == false && optionalNewArg === 'new') {
                await interaction.reply(handleArgument(interaction));
                bets = new betController(databaseConnection);
                await bets.newBet(); // new bets are auto open
                return await interaction.followUp(bets.publicResponseMessage);
            } else if (isBetOpen == false && optionalNewArg === undefined && lastBetFound === true) {
                await interaction.reply(handleArgument(interaction));
                await bets.openBet();
                return await interaction.followUp(bets.publicResponseMessage);
            } else if (lastBetFound === false) {
                console.log(bets);
                abortCondition = true;
                return await interaction.reply(bets.publicResponseMessage); // die on none found?
            } else {
                return await interaction.reply("Bets are already open, Broh~");
            }
        }
    },
};