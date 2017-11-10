var bittrex = require('node-bittrex-api');
var express = require('express');
var router = express.Router();
// var www = require('../bin/www');
// var server = www.server;
// var io = require('socket.io')(server);
var evento = require("evento");

var order_api = require('../bittrex_api/bittrex_api');
order_api.setEventManager(evento,"error");

// config
bittrex.options({
    API_KEY:'1008ea4bd3544382a7e5bebd12ecdd66',
    API_SECRET:'4b912eb00861428289e0cdfeedb4f49e',
});


router.get('/',function(req,res,next){
    var order = {
        market:'USDT-ETH',
        amount: 10,
        rate: "LAST",
        delay: 0,
        type: 'SELL'
    };
    var trigger_name = "";
    order_api.order(trigger_name,order,function(state){
        console.log(state);
        res.render('order',{state:state});
        //res.json(state);
    });
});

router.post('/',function(req,res,next){
    var amount = req.body.amount;
    var market=  req.body.market;
    var order_type = req.body.orderType;
    var rate = req.body.rateList;
    var order = {}
    order.market = market;
    order.amount = parseInt(amount);
    order.rate = rate;
    order.delay =0;
    order.type = order_type;
    var trigger_name = "";
    order_api.order(trigger_name,order,function(state){
        console.log(state);
        res.render('bittrex',{state:state});
        //res.json(state);
    });
});

router.get('/market_update',function(req,res,next){
    bittrex.websockets.subscribe(['USDT-ETH'], function(data, client) {
        if (data.M === 'updateExchangeState') {
            data.A.forEach(function(data_for) {
                console.log('Market Update for '+ data_for.MarketName, data_for);
                io.emit('market_update', {name:data_for.MarketName,data:data_for});
            });
        }
    });
    res.render('market_update', {title:"ronen"});
});

//module.exports = router;
module.exports = {
    router:router,
    setIO: function(iop){
        io = iop;
        io.on('connection',function(socket){

        });
    }
}

