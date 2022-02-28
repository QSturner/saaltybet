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
  let AllBettingPools = await bettingPools.findAll();
  console.log(JSON.stringify(AllBettingPools, null, 2));  
};

async function debugGetAllUsers(){
  let AllUsers = await userID.findAll();
  console.log(JSON.stringify(AllUsers, null, 2));  
};

/*
async function debugDeleteAllUsers(){

};

async function debugDeleteAllTransactions(){

};

async function debugDeleteAllBetsAndPools(){

};
*/


/* 
  uncomment to use debugging function.
*/

//updateUserNames();
//debugGetAllUsers();
//debugGetAllBettingPools();
//debugGetAllBets();
//debugGetAllTransactions();

//console.log("databaseConnection: ", databaseConnection);

async function testDatabaseModelDerivatives() {
let testVal = await databaseConnection.models['tblBets'].findAll();
console.log(JSON.stringify(testVal, null, 2));
};

testDatabaseModelDerivatives();
