/**
 * Created by Ozy on 7/26/2015.
 */
var deckArea = new DeckArea;


$(document).keyup(function(e) {
    if (e.keyCode == 27) { // escape key maps to keycode `27`
        $('.clicked').removeClass('clicked');
        $('.optionsPane').remove();
    }
});

$(document).ready(function () {

    loadDecks(-1);
});

function loadDecks(userId){
    var term = {term:userId};
    $.get('/getDecks',term, function(response) {
        var results = (response);
        displayDecks(results);
    },'json');

}

function displayDecks(decks){
    decks.forEach(function(deck){
        $(".deckList").prepend('<a href="/deck_builder?id='+deck.id+'"><div class="deckListItem">'+deck.name+'</div></a>');
    });
}