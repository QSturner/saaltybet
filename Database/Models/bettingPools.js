module.exports = (sequelize, DataTypes) => {


const bettingPoolModel = sequelize.define('tblPoolBet', {
  runningBetID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bettingpool: DataTypes.INTEGER,
  fighterNo: DataTypes.INTEGER, // fuck it, we want giant battles.
});
// helper methods:

/*
  betsModel.prototype.openBet = function () {
  console.log(`Bet no.:${this.betID} - has been opened.`);
  this.isOpen = true;
}*/

return bettingPoolModel;
};
