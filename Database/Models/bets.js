module.exports = (Sequelize, DataTypes) => { // counted them, should match up... try again
const betsModel = Sequelize.define('tblBets', {
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
})

/* Extending the model with neat features, like opening and closing bets.   */
betsModel.prototype.openBet = function () {
  console.log(`Bet no.:${this.betID} - has been opened.`);
  this.isOpen = true;
}

betsModel.prototype.closeBet = function () {
  console.log(`Bet no.:${this.betID} - has been closed.`);
  this.isOpen = false;
}

/*
// Idea: the betsModel alters the Sequelize Model through the call of "define."
//       hence the pure Sequelize Object doesn't have access to it, but only instances...
*/
return betsModel
};
