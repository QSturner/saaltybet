module.exports = (sequelize, DataTypes) => {
const betPoolModel = sequelize.define('tblPoolBet', {
  runningBetID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bettingpool: { // if true, betting is possible if closed, no more bets.
      type: DataTypes.INTEGER,
      default: 0,
    },
  fighterNo: DataTypes.INTEGER, // fuck it, we want giant battles.
})
// helpers

return betPoolModel;
};
