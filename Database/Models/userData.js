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

/* checks user role. used for command authority
  @param {message}     the original message object that called the command.
  @return {boolean}   will return true if the author of the message is in the defined group, or false if not.
*/
userData.prototype.isAdmin = function (message) {
	return message.member.roles.cache.has("937076188734693458");
}

// Experiment
userData.prototype.helloWorld = function () {
  console.log(`Hello World! \nMy Name is:${this.Name}\nMy ID is ${this.DiscordID}`);
}

return userData;
};
