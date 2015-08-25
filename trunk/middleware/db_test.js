/**
 * Created by Ozy on 4/25/2015.
 */

// database file for connecting to the maria database.
var inspect = require('util').inspect;
var Client = require('mariasql');

var client = new Client();
client.connect({
    host: '127.0.0.1',
    user: 'admin',
    password: 'qwerty1234'
});

client.query("").on()