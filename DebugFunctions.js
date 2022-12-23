const { Sequelize } = require('sequelize');
const { bets, bettingPools, userID, transactions, databaseConnection } = require("./Database/db.js");

async function updateUserNames(){
  let AllUsers = await userID.findAll();
  console.log(JSON.stringify(AllUsers, null, 2));
  //console.log(AllUsers.every(users => user instanceof userID)); // true
  //console.log("All users:", JSON.stringify(users, null, 2));

  // user Tags: "QDynamic#5059","MadZee#5291","NecroBonello#2085","RhettySpaghetti#7965"
  const usersOld = ["QDynamic","MadZee","NecroBonello","RhettySpaghetti"];
  const usersNew = ["QDynamic#5059","MadZee#5291","NecroBonello#2085","RhettySpaghetti#7965"];
  
  for (let x = 0; x < usersOld.length; x++){
    //console.log( "| oldname: " + usersOld[x] +" | newName: " + usersNew[x] );
    await userID.update( 
    {
      Name: usersOld[x],
    },
    {
      where: { 
        Name: usersNew[x],
            }
    });
  }

  console.log("Update completed.\nShowing results:");
  console.log(JSON.stringify(AllUsers, null, 2));

};

// optional param: User or Bet ID's
async function debugGetAllTransactions(){
  let AllTransactions = await transactions.findAll();
  console.log(JSON.stringify(AllTransactions, null, 2));
};

// optional param: Date we want to check
async function debugGetAllBets(){
  let AllBets = await bets.findAll();
  console.log(JSON.stringify(AllBets, null, 2));  
};

async function debugGetAllBettingPools(){
  let AllBettingPools = await databaseConnection.models['tblPoolBet'].findAll();
  console.log(JSON.stringify(AllBettingPools, null, 2));  
};

async function debugGetAllUsers(){
  let AllUsers = await userID.findAll();
  console.log(JSON.stringify(AllUsers, null, 2));  
};

async function showDatabaseStructure(){
  Sequelize.getQueryInterface().showAllSchemas().then((tableObj) => {
      console.log('// Tables in database','==========================');
      console.log(tableObj);
  })
  .catch((err) => {
      console.log('showAllSchemas ERROR',err);
  })
}

async function debugDeleteAllUsers(){

};

async function debugDeleteAllTransactions(){
await transactions.destroy({truncate: true});
};

async function debugDeleteAllBetsAndPools(){
await bettingPools.destroy({truncate: true});
await bets.destroy({truncate: true});
  //let AllBets = await bets.findAll();
  //let AllBettingPools = await bettingPools.findAll();
  
  //console.log(JSON.stringify(AllBets, null, 2));  
  //console.log(JSON.stringify(AllBettingPools, null, 2));  
};



/* 
  uncomment to use debugging function.
*/

//updateUserNames();
//debugGetAllUsers();
debugGetAllBets();
debugGetAllBettingPools();
debugGetAllTransactions();
//debugDeleteAllTransactions();
//debugDeleteAllBetsAndPools();

//showDatabaseStructure();
//console.log("databaseConnection: ", databaseConnection);
//debugDeleteAllBetsAndPools();

//const util = require('util')



//console.log(util.inspect(databaseConnection.models, {showHidden: true, depth: null, colors: true}))



//async function testDatabaseModelDerivatives() {
//let testVal = await databaseConnection.models['tblBets'].findAll();

//console.log(JSON.stringify(testVal, null, 2));
//};

//testDatabaseModelDerivatives();

//async function coolstuff() {
  //let coolGuy = await userID.findOne({
     // where: { 
        //Name: "MadZee",
            //}
    //});
  //coolGuy.helloWorld();
//}

//coolstuff();