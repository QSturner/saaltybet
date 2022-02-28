module.exports = (Sequelize, DataTypes) => { // counted them, should match up... try again
return Sequelize.define('tblBets', {
  betID: {
    primaryKey: true,
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true, // when making a new bet, ignore ID. Database will handle it.
    unique: true,
  },
  // runtime of the bet. after the end a winner gets declared and payouts happen
  betStart: DataTypes.DATE,
  betEnd: DataTypes.DATE,
  isOpen: { // if true, betting is possible if closed, no more bets.
    type: DataTypes.BOOLEAN,
    default: true,
  },
})};