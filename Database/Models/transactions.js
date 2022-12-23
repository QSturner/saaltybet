module.exports = (sequelize, DataTypes) => {
  return sequelize.define('tblTransaction', {
    transactionID: {
      type: DataTypes.INTEGER,
      unique: true,
      primaryKey: true,
      allowNull: false,
      autoIncrement: true,
    },
    amount: { // Allows positive and negative values for all possible scenarios
      type: DataTypes.BIGINT,
      defaultValue: 0,
      allowNull: false,
    },
    userID: { // Fk to userData. makes association to a user possible.
      type: DataTypes.STRING,
      allowNull: false, // each transaction needs somebody who made it to begin with.
    },
    betID: { // FK to bets. makes association of individual transaction to open bets if possible.
      type: DataTypes.INTEGER,
      allowNull: true // makes the BetID optional
    },
    transactionType: { // PUT A,PUT B, WITHDRAW , REMOVE/BANK , REDEEM-REWARD etc.
      type: DataTypes.STRING,
      allowNull: true, // non optional for reasons of processing and reconciliation.
    },
  })};
