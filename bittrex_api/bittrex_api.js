var bittrex = require('node-bittrex-api');
var Client = require('node-rest-client').Client;
var client = new Client();
var jsonfile = require('jsonfile');

var manager = {};
var error_trigger = "";
var coins_map = null;
coins_map= {
    ETH: "ethereum",
    NEO: "neo",
    USDT: "tether",
    BTC: "bitcoin",
    LTC: "litecoin",
    OMG: "omisego",
    LSK: "lisk"
}

if (coins_map == null && false) {
    var file = '../bittrex_api/coin_map.json';
    jsonfile.readFile(file, function (err, obj) {
        if(err)
        {
            console.log(err);

        }
        else
        {
            coins_map = obj;
        }
    });
}

module.exports.setEventManager = function(event_manager, error_trig){
    manager = event_manager;
    error_trigger = error_trig;
};

/** order object
 * {
 * market: 'USDT-ETH'
 * amount: '1.65'
 * rate: 'BID/ASK/LAST'
 * delay: seconds
 * type: 'BUY/SELL'
 * }
 */

/** getMarekeySummary : data object
 *    { success: true,
      message: '',
      result:
       [ { MarketName: 'BTC-LTC',
           High: 0.008357,
           Low: 0.00677804,
           Volume: 165689.16074968,
           Last: 0.007482,
           BaseVolume: 1268.28735005,
           TimeStamp: '2017-11-02T14:41:13.617',
           Bid: 0.00745183,
           Ask: 0.00748197,
           OpenBuyOrders: 1263,
           OpenSellOrders: 13780,
           PrevDay: 0.00833811,
           Created: '2014-02-13T00:00:00' } ] }
 */

/** Time Object
 * {
  BittrexTimeStamp:
  OSTimeStamp:
  Year:
  Month:
  Day:
  Hour:
  Minute:
  Seconds:
  Milliseconds:
 * }
 */

/** coinMarketCap object:
 *     {
        "id": "omisego",
        "name": "OmiseGO",
        "symbol": "OMG",
        "rank": "13",
        "price_usd": "6.58227",
        "price_btc": "0.00091541",
        "24h_volume_usd": "21770900.0",
        "market_cap_usd": "671671627.0",
        "available_supply": "102042552.0",
        "total_supply": "140245398.0",
        "max_supply": null,
        "percent_change_1h": "-0.81",
        "percent_change_24h": "5.28",
        "percent_change_7d": "-8.09",
        "last_updated": "1510045764"
    }
 */

/** order_receipt object:
  {
  id: TimeStamp$market$amount$type
  received: {} V
  status: true/false V
  order: {} V
  data: {} V
  coinMarketCap: {} V
  time: {}
  }
 */

/**
 * received object:(USDT-ETH => base = USDT , trade = ETH)
 * {
 * base:
 * trade:
 * rate:
 * finalAmount:
 * }
 */


/** Time Object
 * {
  BittrexTimeStamp:
  OSTimeStamp:
  Year:
  Month_Name:
  Month:
  Day_Name:
  Day:
  Hour:
  Minute:
  Seconds:
  Milliseconds:
  OSDate:
 * }
 */
// USDT-ETH
// means: sell: ethereum
function extractMarkets(market){
    var market_obj ={};
    var l = market.split("-");
    market_obj.base = l[0];
    market_obj.trade = l[1];
    return market_obj;
};

/**
 * received order related
 */
// construct recieved object
function constructOrderReceived(order,market_data){
    var received = {};
    var coins = extractMarkets(order.market);
    received.base = coins.base;
    received.trade = coins.trade;
    var rate = getRate(order,market_data);
    received.rate = rate;
    received.finalAmount = calcOrder(rate,order);
    console.log("testing:" + received.finalAmount);
    return received;
}
function calcOrder(rate,order){
    var recieved;
    if(order.type =="SELL")
    {
        recieved = rate * order.amount;
    }
    else if(order.type =="BUY"){
        recieved = rate / order.amount;
    }
    return recieved;
};
function getRate(order,market_data){
    var rate;

    if(order.rate == "BID")
    {
        rate = market_data.result[0].Bid;
    }
    else if(order.rate == "ASK")
    {
        rate = market_data.result[0].Ask;
    }
    else if(order.rate == "LAST")
    {
        rate = market_data.result[0].Last;
    }
    return rate;
}

/**
 * time object related
 */

function parseDate(str_date) {
    return new Date(Date.parse(str_date));
}

function constructTime(bittrexTime)
{
    var time ={};
    time.BittrexTime = bittrexTime;
    time.OSTime =new Date();
    var seperated = time.OSTime.toDateString().split(" ");
    time.Day_Name = seperated[0];
    time.Month_Name = seperated[1];
    time.Month = time.OSTime.getMonth()+1;
    time.Year = seperated[3];
    time.Hours = time.OSTime.getHours();
    time.Minute = time.OSTime.getMinutes();
    time.Seconds = time.OSTime.getSeconds();
    time.Milliseconds = time.OSTime.getMilliseconds();
    var t = parseDate(time.OSTime).toTimeString();
    var d= parseDate(time.OSTime).toDateString();
    time.OSTime = t;
    time.OSDate = d;

    return time;
}

/**
 * get state general
 */
// getState
var getState = function(trigger_name,order,callback){
    bittrex.getmarketsummary( { market : order.market}, function( data, err ) {
        var state = {status:true};
        if(err || data ==null)
        {
            state.err = err;
            manager.trigger(error_trigger,err);
            return;
        }
        state.order = order;
        state.data = data.result[0];
        state.received = constructOrderReceived(order,data);
        url = 'http://api.coinmarketcap.com/v1/ticker/'+coins_map[state.received.trade]+'/?convert=USD';
        client.get(url, function (data_, response) {
            state.coinMarketCap = data_[0];
            state.time = constructTime(state.data.TimeStamp);
            manager.trigger(trigger_name,state);
            callback(state);
        });
    });
};
function placeOrder(trigger_name,order,callback) {
    getState(trigger_name,order,callback);
};

module.exports.order = function(trigger_name,order,callback) {
    placeOrder(trigger_name,order,callback);
};

module.exports.buy = function(trigger_name,order) {
    placeOrder(trigger_name,order);
};

module.exports.sell = function(trigger_name,order) {
    placeOrder(trigger_name,order);
};


/**
 * Dijkstra swapping calculations
 */
 // extract BASE and COIN from 'ETH-NEO'
function seperateCoins(market_coins){
  var market ={};
  temp = market_coins.split('-');
  market.base = temp[0];
  market.coin = temp[1];
  return market;
}
// extract from 'ETH-XME' -> rate{base:'ETH',trade:'XME',rate:'0.00678'}
function buildMarketRate(market_obj){
  var rate = seperateCoins(market_obj.MarketName);
  rate._rate = market_obj.Last;
  return rate;
}

var tickers_result = [];
function collector(limit,current,object,callback) {
    tickers_result.push(object);
    if(limit == current) {
        callback(tickers_result);
        current = 0;
    }
}
function prepeareGraph(tickers,callback){
    var rates_list = [];
    let coins_seperated = new Set();
    for(i in tickers.result){
        var rate  =buildMarketRate(tickers.result[i]);
        //rates_list[tickers.result[i].MarketName]= rate;
        rates_list.push(rate);
        coins_seperated.add(rate.coin);
    }
    callback(coins_seperated,rates_list);
  };
/**
 * all tickers
 * @type {number}
 */

 var counter = 0;
module.exports.getAllTickers= function(callback){
    bittrex.getmarketsummaries( function( data, err ) {
        if (err) {
            return console.error(err);
        }
        prepeareGraph(data,callback);
    });
}

/**
 *  TEST
 */


// getAllTickers(function(nodes,rates_list){
//     console.log(rates_list);
//     console.log(nodes);
//   });





