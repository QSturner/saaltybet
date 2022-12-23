const { bets, bettingPools, userID, transactions, databaseConnection } = require("../Database/db.js");

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

buildDatabase();