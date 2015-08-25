var inspect = require('util').inspect;
var Client = require('mariasql');
var client = new Client();
var exports = module.exports = {};
client.connect({
    host: '127.0.0.1',
    user: 'root',
    password: 'qwerty'
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
//get the last message from the db.
//multiple ways to do this, think about later.
exports.lastMessage = function(callback){
    var response = Array();
    client.query('select * from (select * from poll.messages order by timestamp desc limit 15) T1 order by timestamp asc')
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};

exports.recentMessages = function(dateString, callback){
    var response = Array();
    Date.parse(dateString)
    client.query('select * from (select * from poll.messages order by timestamp desc limit 15) T1 where timestamp > '+dateString+' order by timestamp asc')
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};

exports.pushMessage = function(data,callback){
    var response = Array();
    if (Array.isArray(data)) {
        console.log("array");
        data = Array.join(data);
    }
    //client.escape(data); todo escape input.
    console.log(data);


    client.query('insert into poll.messages (message) values ("'+data+'")  ')
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};

exports.cardList = function(callback){
    var response = Array();
    client.query('select * from deck_builder.cards')
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};


exports.cardLookup = function(term, callback){
    var response = Array();
    //client.escape(data); todo escape input.
    console.log(term);
    client.query('select * from deck_builder.cards where cards.name like ("%'+term+'%") or cards.id = "'+term+'"')
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};
exports.getDecks = function(term, callback){
    var response = Array();
    //client.escape(data); todo escape input.
    console.log(term);
    client.query('select * from deck_builder.decks where created_by ='+term)
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};

exports.getDeck = function(term, callback){
    var response = Array();
    //client.escape(data); todo escape input.
    console.log(term);
    client.query('select * from deck_builder.decks where id ='+term)
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};

exports.saveDeck = function(term, callback) {
    var response = Array();
    //client.escape(data); todo escape input.
    var deck = term[0];
    console.log(deck);
    console.log(deck.name);
    if (deck.id == null) {
        // deck does not exist yet.
        client.query('insert into deck_builder.decks (`name`, `summary`, `created_by`) ' +
            'values("' + deck.name + '", "' + deck.summary + '", "' + deck.userId + '");')
            .on('result', function (res) {
                res.on('row', function (row) {
                })
                    .on('error', function (err) {
                        console.log('Result error: ' + inspect(err));
                    })
                    .on('end', function (info) {
                        response.push(info);
                        console.log("deck:" + info.insertId);
                        deck.cards.forEach(function (card) {
                            console.log('insert card');
                            client.query('insert into  deck_builder.decks_link (`deck_id`, `card_id`, `type`) values (' + info.insertId + ',' + card.id + ',"mainboard")')
                                .on('result', function (res) {
                                    res.on('row', function (row) {
                                    })
                                        .on('error', function (err) {
                                            console.log('Result error: ' + inspect(err));
                                        })
                                        .on('end', function (info) {
                                            response.push(info);
                                            console.log('Result finished successfully');
                                        });
                                })
                                .on('end', function () {
                                    console.log('Done with all results');
                                    callback(response);
                                });
                        });
                        console.log('Result finished successfully');
                    });
            })
            .on('end', function () {
                console.log('Done with all results');
                callback(response);
            });
    } else {
        client.query('update deck_builder.decks set `name` = "' + deck.name + '", `summary` ="' + deck.summary + '" where id = ' + deck.id + '')
            .on('result', function (res) {
                res.on('row', function (row) {
                })
                    .on('error', function (err) {
                        console.log('Result error: ' + inspect(err));
                    })
                    .on('end', function (info) {
                        response.push(info);
                        console.log("deck:" + info.insertId);
                        client.query('delete from deck_builder.decks_link where deck_id = ' + deck.id)
                            .on('result', function (res) {
                                res.on('row', function (row) {
                                })
                                    .on('error', function (err) {
                                        console.log('Result error: ' + inspect(err));
                                    })
                                    .on('end', function (info) {
                                        console.log('Links Deleted successfully');
                                    });
                            })
                            .on('end', function () {
                                console.log('Done with all results');
                                deck.cards.forEach(function (card) {
                                    console.log('insert card');
                                    client.query('insert into  deck_builder.decks_link (`deck_id`, `card_id`, `type`) values (' + deck.id + ',' + card.id + ',"mainboard")')
                                        .on('result', function (res) {
                                            res.on('row', function (row) {
                                            })
                                                .on('error', function (err) {
                                                    console.log('Result error: ' + inspect(err));
                                                })
                                                .on('end', function (info) {
                                                    console.log('Links added successfully');
                                                });
                                        })
                                        .on('end', function () {
                                            console.log('Done with all results');
                                        });
                                });

                                console.log('Result finished successfully');
                            });
                    })
                    .on('end', function () {
                        console.log('Done with all results');
                        callback(response);
                    });
            });
    }
}

//get the list of all cards in a deck.
exports.getDeckCards = function(term, callback){
    var response = Array();
    //client.escape(data); todo escape input.
    var deckId = term;
    client.query('select * from deck_builder.decks_link where deck_id = '+deckId)
        .on('result', function(res) {
            res.on('row', function(row) {
                response.push(row);
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
            callback(response);
        });
};