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
    //betStart: DataTypes.DATE,
    //betEnd: DataTypes.DATE,
    isOpen: { // if true, betting is possible if closed, no more bets.
      type: DataTypes.BOOLEAN,
      default: 1,
    },
  })

  /* Extending the model with neat features, like opening and closing bets.   */
  betsModel.prototype.openBet = function() {
    console.log(`Bet no.:${this.betID} - has been opened.`);
    this.isOpen = true;
  }

  betsModel.prototype.closeBet = function() {
    console.log(`Bet no.:${this.betID} - has been closed.`);
    this.isOpen = false;
  }

  /* checks if there are any bets already open. returns true if true, false if false. 
      necessary to determine if a new bet should be opened or not
  */
  betsModel.prototype.checkForOpenBets = async function() {
    // tell me how many open bets exist atm.
    console.log(betsModel);
    let isOpen = await betsModel.count({ where: { isOpen: 1 } }).then(
      function(result) {
        
        console.log(result);
        if (result > 0) {
          return true;
        } else {
          return false;
        }
      });
    return isOpen;
  }

  /*
  // Idea: the betsModel alters the Sequelize Model through the call of "define."
  //       hence the pure Sequelize Object doesn't have access to it, but only instances...
  */
  return betsModel
};
