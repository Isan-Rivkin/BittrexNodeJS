var bittrex = require('node-bittrex-api');

var manager = {};

module.exports.setEventManager = function(event_manager){
    manager = event_manager;
};

// getState
module.exports.getState = function(trigger_name,market){
    bittrex.getmarketsummary( { market : market}, function( data, err ) {
        if(err)
        {
            manager.trigger(trigger_name,err);
        }
        manager.trigger(trigger_name,data);
    });
};


