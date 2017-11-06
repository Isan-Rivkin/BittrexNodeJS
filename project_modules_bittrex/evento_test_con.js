/*
 - other.setEventManager(evento);
 - other.doStuff(trigger_name)
 */
 var manager = {};

module.exports.setEventManager = function(event_manager){
 	manager = event_manager;
 };

 module.exports.doStuff = function(trigger_name){
 	var result = {};
 	result.data = "very nice data from evento test con .js";
 	result.status = "success";
 	manager.trigger(trigger_name, result);
 }


module.exports.test = function(p)
{
 	console.log("test ok:" + p );
};