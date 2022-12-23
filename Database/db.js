/* database related stuffs*/
const { Sequelize } = require('sequelize');

// Establish connection to DB File 

/*
  Connection Object. contains the Sequelize Class Object for the session.
  gets called once and then passed around
*/
const databaseConnection = new Sequelize({
  dialect: 'sqlite',
  storage: './Database/saaltyDB.db'
});

try {
  databaseConnection.authenticate();
  console.log('Connection has been established successfully.');

} catch (error) {
  console.error('Unable to connect to the database:', error);
};

// as seen in https://discordjs.guide/sequelize/currency.html#initialize-database
const bets = require("../Database/Models/bets.js")(databaseConnection, Sequelize.DataTypes);
const bettingPools = require("../Database/Models/bettingPools.js")(databaseConnection, Sequelize.DataTypes);
const userID = require("../Database/Models/userData.js")(databaseConnection, Sequelize.DataTypes);
const transactions = require("../Database/Models/transactions.js")(databaseConnection, Sequelize.DataTypes);

/*
  Creates the Entity Relationship Model.
*/
setRelationships = function () {
  bets.hasMany(bettingPools, {
    foreignKey: 'runningBetID'
  });
  bettingPools.belongsTo(bets);
  userID.hasMany(transactions);
  transactions.belongsTo(userID, {
    foreignKey: 'userID'
  });
};

/*
  Mehod that takes all the models and builds the Database. Only gets executed once in the project.
  Hence why we expose it for easy calling from command line :D
*/
function buildDatabase() {
  console.log('Building Database Model...');
  setRelationships();
  databaseConnection.sync();
  return console.log("Database synched");
};

//buildDatabase();
module.exports = {bets, bettingPools, userID, transactions, databaseConnection};