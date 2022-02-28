module.exports = (sequelize, DataTypes) => {
return sequelize.define('tblPoolBet', {
  runningBetID: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  bettingpool: DataTypes.INTEGER,
  fighterNo: DataTypes.INTEGER, // fuck it, we want giant battles.
})};
