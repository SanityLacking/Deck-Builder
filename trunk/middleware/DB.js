// database file for connecting to the maria database.
var inspect = require('util').inspect;
var Client = require('mariasql');

var client = new Client();
client.connect({
    host: '127.0.0.1',
    user: 'admin',
    password: 'qwerty1234'
});

client.on('connect', function() {
    console.log('Client connected');
})
    .on('error', function(err) {
        console.log('Client error: ' + err);
    })
    .on('close', function(hadError) {
        console.log('Client closed');
    });

client.query('SHOW DATABASES')
    .on('result', function(res) {
        res.on('row', function(row) {
            console.log('Result row: ' + inspect(row));
        })
            .on('error', function(err) {
                console.log('Result error: ' + inspect(err));
            })
            .on('end', function(info) {
                console.log('Result finished successfully');
            });
    })
    .on('end', function() {
        console.log('Done with all results');
    });

client.end();