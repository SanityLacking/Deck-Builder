/**
 * Created by Ozy on 8/9/2015.
 */
function Deck(id, type, format, private){
    this.cardCount;
    this.id = null;
    this.type = "mtg";
    this.cards = [];
    this.name = "deck"
    this.summary = "deck summary";

    this.private = false;
    this.format = "standard";
    this.userId = -1;
    if(id != null)
        this.id = id;
    if(type != null)
        this.type = type;
    if(format != null)
        this.format = format;
    if(private != null)
        this.private = private;
}
Deck.prototype.cardCount = function(type) {
    var count = 0;
    if (type == null){
        //return count of all cards in the deck.
        if ( typeof this.cards.length != 'undefined')
            count = this.cards.length;
    }else {
        this.cards.forEach(function(card){
            if (card.type == type)
                count++;
        })
    }
    return count;
}

Deck.prototype.addCard = function(data) {
    console.log("add new card");
    var newCard = new Card(data);
    this.cards.push(newCard);
    return this.cards.length;
}

Deck.prototype.saveDeck = function() {
    console.log("save deck function");

}
