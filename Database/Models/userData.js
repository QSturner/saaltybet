module.exports = (sequelize, DataTypes) => {
	return sequelize.define('tblUserdata', {
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
};