const { EmbedBuilder } = require("discord.js");
const { SlashCommandBuilder } = require('discord.js')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of the available commands, how to use them, and their function.'),
    async execute(interaction) {
        const embed = new EmbedBuilder()
            .setTitle("Saa-lty Bet Bot Help")
            .setColor(0xD35FFF)
            .setDescription("Disclaimer: This list is subject to change.")
            .addFields(
                { name: "General Commands", 
                value: "**$amehysst [@Username]** - Shows the amount of currency for the user specified" +
                "\n" +
                "**$bet [fighterNumber] [amountInAmehysst]** - Lets the user place a bet into the betting pool of the fighter of their choosing. Bot checks if possible, else replies with an error message. If possible, Bot replies with a confirmation message." +
                "\n" +
                "**$botinfo** - Displays info about the bot: name, version, description, license and developers" +
                "\n" +
                "**$echo [message to be echoed]** - Causes the bot to repeat whatever is entered alongside the command" +
                "\n" +
                "**$money [@Username]** - Shows the amount of currency for the user specified" +
                "\n" +
                "**$mymoney** - Shows the amount of the message author's currency" +
                "\n" +
                "**$ok-sss** - Replies with Saa's signature catchphrase!" +
                "\n" +
                "**$register [Name]** - Registers the user into the database used for betting" },
                { name: "Admin Commands",
                value: "**$closebets** - ADMIN command that closes the betting pool. will prevent all players from placing new bets." +
                "\n" +
                "**$openbets [optional: new]** - ADMIN command that opens the betting pool. for the current bet, or opens a new one." +
                "\n" +
                "**$result [winningFighterNumber]** - ADMIN command that allows admins to tell the bot the winner of the match. Bot sends confirmation message and internally allocates money accordingly." +
                "\n" +
                "**$teller [Name OR @Username] [amount]** - ADMIN command that allows for subtraction and addition of currency from a specified user's balance" },
            );
            
        await interaction.reply({ embeds: [embed] });
    }
}