const { SlashCommandBuilder } = require('discord.js');
const transaction = require("../Database/Controllers/generateTransaction.js");
const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");
const { Op } = require('@sequelize/core');

/**
 * Determines the type of transaction and creates a new transaction using the generateTransactions controller
 * @param {id} targetUserID The discord id of the user targeted by the command
 * @param {number} transactionAmount The amount of money specified in the transaction
 * @return {Model} The newly created transaction 
*/
async function generateTransaction(targetUserID, transactionAmount) {
	const t1 = new transaction(databaseConnection, "ADMIN", targetUserID, transactionAmount);
  await t1.init().then(
    async (value) => {
      await t1.commitTransaction();
    });
	return t1;
}

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
        .setName('teller')
        .setDescription('ADMIN command that lets any admin subtract or add currency to participants\' balances.')
        .addStringOption(option =>
            option.setName('username')
            .setDescription('User\'s @username')
            .setRequired(true))
        .addNumberOption(option =>
            option.setName('amount')
            .setDescription('Amount of money to be added/subtracted')
            .setRequired(true)),
    async execute(interaction) {
        let targetUserInstance;
        
        // Assign args to temp variables for pre-evaluation (and debugging)
		var targetUser = interaction.options.getString('username');
		var transactionAmount = interaction.options.getNumber('amount');
		var queryString = ``;
		let targetUserID = getDiscordIDFromTag(targetUser);

        const findUserQuery = await userID.findAll({ 
			where: { 
				[Op.or]: [{ Name: `${targetUser}` }, { DiscordID: `${targetUserID}` }]
			} 
		});

        // Querying database for entered user
		if (findUserQuery !== null && targetUser.substring(0, 3) === "<@!") {
            console.log("Case A: TAG");
            targetUserInstance = await userID.findOne({where: { DiscordID: `${targetUserID}` } });
        } else {
            console.log("Case B: Username");
            targetUserInstance = await userID.findOne({where: { Name: `${interaction.options.getString('username')}` } });
        }

        // Checks to see if command sender is in admin guild
        if (targetUserInstance !== null && targetUserInstance.isAdmin(interaction) == false) {
            await interaction.reply("You do not have access to this command, ok sss?");
        }
      
        // Makes sure user entered exists in the database
        if (targetUserInstance === null) {
            await interaction.reply("User's Saa-ltyBet account doesn't exist. Register the user first.");
        } else {
            // creating new transaction.
            const createdTransaction = generateTransaction(targetUserInstance.DiscordID, transactionAmount);
            // outputting result.
            await interaction.reply(`${createdTransaction.transactionReply}`);
        }
    },
};