
///*
//Description:  Method generates the sequelize Datamodels
//Inputs: sequelize context object
//Outputs: true on success, error code on error.
//*/
//  const userData = sequelize.define('tblUserdata', {
//  	DiscordID: {
//  		type: Sequelize.STRING,
//  		unique: true,
//      primaryKey:true
//  	},
//  	Name: Sequelize.STRING,
//  	username: Sequelize.STRING,
//  	currentMoney: {
//  		type: Sequelize.DOUBLE,
//  		defaultValue: 500,
//  		allowNull: false,
//  	},
//    timestamps: false,
//    createdAt: 'creationDate'
//  });
//  const transactions = sequelize.define('tblTransaction', {
//    transactionID: {
//      type: Sequelize.INTEGER,
//      unique: true,
//      primaryKey: true,
//    },
//    amount: {
//      type: Sequelize.DOUBLE,
//      defaultValue: 0,
//      allowNull: false,
//    },
//    userID: {
//      type: Sequelize.STRING,
//      allowNull: null,
//    },
//    betID: {
//      type: Sequelize.Integer
//    },
//    transactionType: { // PUT or WITHDRAW
//      type: Sequelize.String,
//      allowNull: false,
//    },
//
//  });
//  //  Each running BET has 2 betting pools. One for fighter 1 and one for fighter 2.
//  //  FK relation 1 runningBET > 2 per bet.
//  const bettingPools = sequelize.define('tblPoolBet', {
//    runningBetID: {
//      type: Sequelize.INTEGER,
//      allowNull: false,
//    },
//    bettingpool: Sequelize.DOUBLE,
//    fighterNo: Sequelize.BYTE,
//
//  });
//  const bets = sequelize.define('tblBets', {
//    betID: {
//      primaryKey: true,
//      type: Sequelize.INTEGER,
//      unique: true,
//    },
//    // runtime of the bet. after the end a winner gets declared and payouts happen
//    betStart: Sequelize.DATE,
//    betEnd: Sequelize.DATE,
//    isOpen: { // if true, betting is possible if closed, no more bets.
//      type: Sequelize.BOOLEAN,
//      default: true
//    },
//  });


// Original from
