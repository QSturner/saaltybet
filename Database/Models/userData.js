const { UserFlags } = require("discord.js");

module.exports = (sequelize, DataTypes) => {
	const userData = sequelize.define('tblUserdata', {
  	DiscordID: {
  		type: DataTypes.STRING,
  		unique: true,
      primaryKey: true,
      allowNull: false,
  	},
  	Name: DataTypes.STRING,
  	username: DataTypes.STRING,
  	currentMoney: {
  		type: DataTypes.INTEGER,
  		defaultValue: 500, /* default value as per agreement with Necro Bonello */
  		allowNull: false,
  	},
    timestamps: false,
    createdAt: 'creationDate'
  })

/**
 * checks user role. used for command authority
 * @param {Discord.CommandInteraction} interaction The interaction
 * @return {boolean} Will return true if the author of the message is in the defined group, or false if not.
*/
userData.prototype.isAdmin = function (interaction) {
  return interaction.member.roles.cache.has("937076188734693458");
}

/*
  takes a @User Discord thingy and turns it into a DiscordID.
*/
userData.prototype.getDiscordIDfromTag = function (inputString) {
  let closeBracket = inputString.indexOf(">");
  return inputString.slice(3, closeBracket);
}

/*
  find a UserInstance with the DiscordTag
*/
userData.prototype.findUserByTag = async function (DiscordTag) {
  let DiscordID = this.getDiscordIDfromTag(DiscordTag);
  this.findOne({ where: { DiscordID: `${DiscordID}` } });
}

/*
  Code to display the amehysst emoji
*/
userData.prototype.getAmehysstEmoji = async function(interaction) {
  return interaction.client.emojis.cache.find(emoji => emoji.name === 'amehysst');
}
  
return userData;
};