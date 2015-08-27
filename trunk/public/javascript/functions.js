/**
 * Created by Ozy on 3/15/2015.
 */

function drawRect (){

}

function initStage(){
    var stage = new Kinetic.Stage({
        container: "playArea",
        width: 1000,
        height: 1000
    });
    return stage;
}
function addImage (src, stage){
    //$('#'+area).append('<div class="draggable card"><img  src="'+src+'"><img class = "close-btn" src="images/icons/close-btn.png"></div>');

    var imageObj = new Image();
    imageObj.src = src;

    imageObj.onload = function() {
        var layer = new Kinetic.Layer();
        var img = new Kinetic.Image({
            image: imageObj,
            x: 100,
            y: 30,
            width: 200,
            height: 137,
            draggable: true
        });

        // add cursor styling
        img.on('mouseover', function() {
            document.body.style.cursor = 'pointer';
        });
        img.on('mouseout', function() {
            document.body.style.cursor = 'default';
        });
        layer.add(img);
        stage.add(layer);
    };
}


function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.append(document.getElementById(data));
}

function setupDragable (){
    $(".draggable").each(function(){
        $(this).prop('draggable',true).addEventListener('dragstart', function(evt){
           drag(evt);
        });
    })
}

/*
removes white spaces from names to allow them to be used as ids in html
todo extend this for all html unfriendly possibilities
 */
function htmlParse(string){
         return string.replace(/( )+/g,"_");
}
/*
 reverts htmlParse.
 */
function htmlUnParse(string){
    return string.replace(/(_)+/g," ");
}

function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}
