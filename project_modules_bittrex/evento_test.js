var evento = require("evento");

/*evento.on("res",(arg)=>{
	console.log('finished-> ' + JSON.stringify(arg));
});
evento.on("Event", function(arg){
    console.log("this is callback arg:" + JSON.stringify(arg));
    evento.trigger("res", {ronen:"reponse finished"});
});

// trigger with argument
evento.trigger("Event", {ronen:"hi"});
*/
evento.on("trig",function(obj){
	console.log('good triggerd!: ' +JSON.stringify(obj));
});
var other = require('./evento_test_con.js');
other.setEventManager(evento);
other.doStuff("trig");

/**
 - other = require
 - other.setEventManager(evento);
 - other.doStuff(trigger_name)
 - on(trigger_name)=> {... }
*/