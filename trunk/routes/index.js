var express = require('express');
var bodyParser = require('body-parser');
var router = express.Router();
count = 0;
/* GET home page. */

router.get('/helloworld', function(req, res){
  res.render('helloworld', {title:'Hello World!'})
});

router.get('/snake', function(req, res){
    res.render('snake', {title:'Snake!'})
});
//------------------------Pages--------------------//
router.get('/index', function(req, res, next) {
    console.log("front desk");
    res.render('front_page', { title: 'Express' });
});

router.get('/', function(req, res, next) {
    res.render('deck_builder', { title: 'Express' });
});
router.get('/deck_list', function(req, res, next) {
    res.render('deck_list', { title: 'Express' });
});
router.get('/deck_builder', function(req, res, next) {
    res.render('deck_builder', { title: 'Express' });
});
router.get('/about', function(req, res, next) {
    res.render('about', { title: 'Express' });
});
router.get('/tutorial', function(req, res, next) {
    console.log("tutorial");
    res.render('tutorial', { title: 'Express' });
});



//------------------------API Calls--------------------//
router.post('/saveDeck', function(req, res){
    console.log("saveDeck");
    var poll = require('../middleware/poll.js');
    var term = JSON.parse(req.body.data);
    poll.saveDeck(term,returnData);
    function returnData(data){
        res.json(data);
        res.end();
    }
});

router.get('/card_list', function(req, res){
    console.log("card_list");
    var poll = require('../middleware/poll.js');
    poll.cardList(returnData);
    function returnData(data){
        if (data.length == 0) {
            var data = "No Data Found";
            res.end(data, "utf-8");
        }
        res.json(data);
        res.end();
    }
});

router.get('/cardLookup', function(req, res){
    console.log("cardLookup");
    var poll = require('../middleware/poll.js');
    console.log(req.query.term);
    poll.cardLookup(req.query.term,returnData);
    function returnData(data){
        res.json(data);
        res.end();
    }
});
//return all decks for user
router.get('/getDecks', function(req, res){
    console.log("Get Decks");
    var poll = require('../middleware/poll.js');
    console.log(req.query.term);
    poll.getDecks(req.query.term,returnData);
    function returnData(data){
        res.json(data);
        res.end();
    }
});

//return deck information.
router.get('/getDeck', function(req, res){
    console.log("Get Deck");
    var poll = require('../middleware/poll.js');
    console.log(req.query.term);
    poll.getDeck(req.query.term,returnData);
    function returnData(data){
        res.json(data);
        res.end();
    }
});
//get the list of all cards in a deck.
router.get('/getDeckCards', function(req, res){
    console.log("Get Deck Cards");
    var poll = require('../middleware/poll.js');
    console.log(req.query.term);
    poll.getDeckCards(req.query.term,returnData);
    function returnData(data){
        res.json(data);
        res.end();
    }
});



//-------------------Messaging Client---------------------//
router.get('/messaging_client', function(req, res){
    res.render('messaging_client', {title:'Hello World!'})
});
router.get('/poll', function(req, res){
    console.log("test");
    var poll = require('../middleware/poll.js');
    poll.lastMessage(returnData);
    function returnData(data){
        console.log(data.length);
        if (data.length == 0) {
            var data = "No Messages Found";
            res.end(data, "utf-8");
        }
        res.json(data);
        res.end();
    }
});


router.post('/push', function(req, res){
  try {
      var chat = require('../middleware/poll.js');
      chat.pushMessage(req.body.message, returnMessage);

      function returnMessage(data){
          res.json(data);
          res.end();
      }


  }catch(err){
      console.log(err);
      res.end();
  }
});

module.exports = router;
