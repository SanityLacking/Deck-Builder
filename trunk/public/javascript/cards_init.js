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

$(document).click(function(e) {
});

$(document).ready(function () {
    loadDeck();
    $('#menu').click(function(){
        if($('.menu').hasClass('hidden')){
            $('.menu').removeClass('hidden');
        }else{
            $('.menu').addClass('hidden');
        }
    });

    $('#deckName').change(function(){
        if($(this).val()=="") {
            $(this).addClass('whiteBackground');
            $('#clearDeckName').hide();
            deckArea.deck.name = "";
        }else {
            $(this).removeClass('whiteBackground');
            $('#clearDeckName').show();
        }
        deckArea.deck.name = $(this).val();
    });

    $('#playArea').click(function(){
        console.log("playArea");
    });
    $('#closeBtn').click(function () {
        console.log("close button");
        $('#searchInput').val('');
        $('#searchInput').autocomplete( 'close' );
        cardDisplay(null);
    });
    $('#saveDeck').click(function(){
        console.log("save button");
        deckArea.saveDeck();
    });
    $('#sidebarBtnClose').click(function () {
        $(".statBar").hide();
        $('#sidebarBtnOpen').show();
    });
    $('#sidebarBtnOpen').click(function () {
        $(".statBar").show();
        $('#sidebarBtnOpen').hide();
    });
    $('#searchInput').autocomplete({
        source: cardLookup,
        minLength: 2,
        select: function( event, ui ) {
            cardLookupData(ui.item.value, function (response) {
                cardDisplay(response);
            });
        }
    });

    $('#searchInput').change(function () {
        cardLookupData($('#searchInput').val(), function (response) {
            cardDisplay(response);

        });
    });


});
function cardLookup(term, res){
    if($.type(term) === "string")
        term = {term:term};

    $.get('/cardLookup/',term, function(response) {
        var returnData = Array();
        response.forEach(function (card) {
            returnData.push(card.name);
        });
        console.log(returnData);
        res(returnData);
    });
}

function cardLookupData(term, res){
    if($.type(term) === "string")
        term = {term:term};


    $.get('/cardLookup/',term, function(response) {
        var returnData = Array();
        response.forEach(function (card) {
            returnData.push(card);
        });
        console.log(returnData);
        res(returnData);
    });
}
//display the cards that have been searched. display in .topbar
function cardDisplay(cards){
    var topbar = $('.topbar');
    topbar.empty();
    if (cards == null) {
        topbar.addClass('hidden');
        return null;
    }
    var offset = 0;
    cards.forEach(function(card){
        // split into two vars for the purpose of better event handling.
        var cardContainer =$('<div class="top-container"></div>');
        var cardHtml =$('<div class="card" id="'+htmlParse(card.name)+'"><img class="img-card" src="images/mtg-cards/'+(card.set_code != null? card.set_code+'/':'')+card.image_uri+'"></div>')
            .click(function(){
                if ($(this).hasClass('clicked')){
                    deckArea.addCard($(this).attr('id'),1);
                    $('.card.clicked').removeClass('clicked');
                    return null
                }

                $('.card.clicked').removeClass('clicked');
                $(this).addClass('clicked');
            });
        cardContainer.append(cardHtml);
        topbar.append(cardContainer);
        if (topbar.children().length == 1){
            //Only one card loaded so select the card and display options.
            var options =$('<div class="options">' +
                '<div> Mainboard: <span id="mainboardAdd1" class="buttonAdd">Add Card</span> <span id="mainboardAdd4" class="buttonAdd">Add 4</span></div>' +
                '<div> Sideboard: <span id="sideboardAdd1" class="buttonAdd">Add Card</span> <span id="sideboardAdd4" class="buttonAdd">Add 4</span></div>' +
                '</div>');
            cardContainer.addClass('clicked').append(options);
            $('#mainboardAdd1').click(function(){
                deckArea.addCard(card.name, 1)
            });
            $('#mainboardAdd4').click(function(){
                deckArea.addCard(card.name, 4)
            });
            $('#sideboardAdd1').click(function(){
                deckArea.addCard(card.name, 1)
            });
            $('#sideboardAdd4').click(function(){
                deckArea.addCard(card.name, 4)
            });
        }
    });
    $('#searchInput').autocomplete( "close" );
    topbar.removeClass('hidden');
}
function loadDeck(deck){

    if (typeof deck == 'undefined'){
        console.log("load deck");
        var query = getQueryParams(document.location.search);
        if (typeof query.id !="undefined"){
            var term = {term:query.id};
            $.get('/getDeck',term, function(response) {
                var results = (response);
                loadDeck(results);
            },'json');
        }
    }else{
        console.log("initialize deck");
        console.log(deck[0]);
        deckArea.deck.id = deck[0].id;
        deckArea.deck.name = deck[0].name;
        console.log(deck[0].name);
        $("#deckName").val(deck[0].name);
        deckArea.deck.summary = deck[0].summary;
        deckArea.deck.type = deck[0].type;
        // deck definitely exists, now load all cards. load name
        var term = {term:deck[0].id};
        $.get('/getDeckCards',term, function(response) {
            console.log("getDeckCards");
            console.log(response);
            var results = (response);
            results.forEach(function(card){
                deckArea.addCard(card.card_id, 1);
            });
        },'json');
    }
}

