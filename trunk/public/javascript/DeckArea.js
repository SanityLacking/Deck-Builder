/**
 *
 * Created by Ozy on 8/5/2015.
 */

function DeckArea(){
    this.cardCount = 0;
    this.deck = new Deck(null, "mtg");
    this.x = 50;
    this.y = 100;

};

/*
 Add card(s) to deck area object.
 */
DeckArea.prototype.addCard = function(name, number){
    if (number == null)
        number = 1;
    console.log(name);
    var term = htmlUnParse(name);
    if($.type(term) === "string")
        term = {term:term};
    var currentArea = this;
    $.get('/cardLookup/',term, function(response) {
        console.log(response);
        response.forEach(function(card){
            for (var i = 0; i < number; i++) {
                console.log("deck adding new card");
                var counter = currentArea.deck.addCard(card);

                var cardHtml = $('<div class="cardContainer"><div class="deckCard" name="' + htmlParse(card.name) + '" number = "'+counter+'"><img class="img-card" src="images/mtg-cards/'+(card.set_code != null? card.set_code+'/':'')+ card.image_uri + '"></div></div>')
                    .click(function () {
                        if ($(this).hasClass('clicked')) {

                        }
                        $('.optionsPane').remove();
                        var cardOption = $('<div class="optionsPane"></div>');
                        var addAnother=$('<p>add another</p>').click(function(){
                            currentArea.addCard(card.name);
                            cardOption.remove();
                            });
                        var remove=$('<p>remove</p>').click(function(){
                            currentArea.deck.cards.splice(cardHtml.children(".deckCard").attr('number')-1,1);

                            cardHtml.remove();
                            cardOption.remove();
                            if($("#"+card.type).find('.cardContainer').length == 0){
                                //$("#"+card.type).addClass('hidden');
                            }
                        });
                        //todo add X more option.
                        //todo find on gatherer option.

                        cardOption.append(addAnother).append(remove);
                        $(this).append(cardOption);
                        $('#playArea.card.clicked').removeClass('clicked');
                        $(this).addClass('clicked');
                    });
                var cardType = $("#"+card.type);
                if(cardType.find('.cardContainer').length > 0 && cardType.hasClass('hidden')){
                    cardType.removeClass('hidden');
                }
                cardType.find('.columnCounter').text(currentArea.deck.cardCount(card.type));
                cardType.children('.cardColumn').append(cardHtml);
            }
        });
    });
};

/*
Save the deck.

 */
DeckArea.prototype.saveDeck = function(){
    console.log('deck save function');
        //var term = this.deck;
    var term = JSON.stringify($(deckArea.deck));
        $.post('/saveDeck',{data:term}, function(response) {
            console.log(response);
            var results = (response[0]);
            if (results.insertId){
                deckArea.deck.id = results.insertId;
                alert("Deck has been saved.");
            }
            else{
                alert("Something went wrong and the deck was not saved.");
            }
        },'json');
};

