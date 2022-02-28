const Client = require("./structures/client.js");
const token = process.env['token'];
const prefix = "$";
const client = new Client();

client.start(token);