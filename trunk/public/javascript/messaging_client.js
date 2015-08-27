// Client code
var poll = function(data) {
    $.get('/poll/', function(response) {
        var elem = $('#output');
        var timestamp = Date.parse(elem.attr('timestamp'));
        // var response = JSON.parse(response);

        response.forEach(function(data){
            if (isNaN(timestamp)){
                timestamp = Date.parse(data.timestamp);
                elem.html("<p class='unimportant'>"+data.message+"</p>");
            }else if (timestamp < Date.parse(data.timestamp)){

                timestamp = Date.parse(data.timestamp);
                elem.html(elem.html()+"<p class='unimportant'>"+data.message+"</p>");
            }
            elem.attr('timestamp',timestamp);
        })
        // else{
        //     elem.text(elem.text() +" "+ response);
        //
        // }
        //
        // elem.text(elem.text() +" "+ response);
        // //poll();
    });
}

var post = function(data) {
    $.post('/push/',{message:data}, function(response) {
        var elem = $('#output');
        var timestamp = Date.parse(elem.attr('timestamp'));
        elem.html(elem.html()+"<p class='message'>"+data+"</p>");
    });
}
$(document).ready(function(){
    $("button.btn-send").on('click',function(){
        var input = $("#input").val();
        if (input)
            post(input);
        else
            console.log("no text to send.");

        $("#input").val("");
    });

    var counter = 0;

    while (counter < 1 ){
        counter++;
        poll();
    }


});


