var socket = io();
console.log("connected to websocket");
socket.on('welcome', function(data) {
    console.log('Got welcome from the server');
});
socket.on('nodes',handle_nodes);
socket.on('message', handle_message);

var prout = "";

function handle_nodes(data) {
    data = data.replace("nodes:","");
    $("#messages").prepend("<li><i><strong>nodes:</strong>" + data + "</i></li>");
    data = data.split(',');
}

function handle_message(data) {
    $("#messages").prepend("<li><strong>" + data.node + ":</strong>" + data.message + "</li>");
    // si message de type addr;addr;rssi, c'est que le noeud a recu le ping
    if(data.message.split(";").length == 3)
        sonar(data.node);
}

var site = $("#site");
$("#resources").on("click", function() {
    if(site.val() != "")
        socket.emit('resources', site.val(), function(data){
            console.log("received response with " + data.items.length + " resources");
            var resources = data.items;
            var nodes = new Array();
            for(var i=0;i<resources.length;i++) {
                console.log(resources[i].network_address);
                node = new Array();
                n_addr = resources[i].network_address;
                node[0] = n_addr.substring(0,n_addr.indexOf("."));
                node[1] = resources[i].x;
                node[2] = resources[i].y;
                node[3] = resources[i].z;
                node[4] = resources[i].archi;
                node[5] = resources[i].state;
                nodes[i] = node;
            }
            loadNodes(nodes);
            //upgradeNodes([]);
            init_3d();
        });
});

$("#site").on("change", function() {
    var isCC2420 = site.val() == "euratech" || site.val()=="rennes"
    $("#sonar7").prop("disabled",isCC2420);
    $("#sonar8").prop("disabled",isCC2420);
});

$('#reset').on("click", function () {
    unselect();
    init_color();
    myrender();
});

$('#nodes').on("click", function() {
    socket.emit('nodes');
});

//$('#send').on("submit", function() {
//    preventDefault();
$('#send').on("click", function() {
    console.log("envoi");
    socket.emit('message', $("#command").val());
});

//Sonar -30dbm
$('#sonar1').click(function () {
    socket.emit('message', selectedNodes[0]+';a');
    
})

//Sonar -20dbm
$('#sonar2').click(function () {
    socket.emit('message', selectedNodes[0]+';b');
    
})

//Sonar -15dbm
$('#sonar3').click(function () {
    socket.emit('message', selectedNodes[0]+';c');
    
})

//Sonar -10dbm
$('#sonar4').click(function () {
    socket.emit('message', selectedNodes[0]+';d');
    
})    

//Sonar -5dbm
$('#sonar5').click(function () {
    socket.emit('message', selectedNodes[0]+';e');
    
}) 

//Sonar 0dbm
$('#sonar6').click(function () {
    socket.emit('message', selectedNodes[0]+';f');
    
})    

//Sonar +5dbm
$('#sonar7').click(function () {
    socket.emit('message', selectedNodes[0]+';g');
    
})

//Sonar +10dbm
$('#sonar8').click(function () {
    socket.emit('message', selectedNodes[0]+';h');
    
})
