var express = require('express');
var router = express.Router();
var exportedObject = require('../bin/www');
var io = null;



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

//module.exports = router;
module.exports = {
    router:router,
    setIO: function(iop){
      io = iop;
        io.on('connection',function(socket){

    console.log('user connected DEDI DEDI DEDI DEDI ');
    socket.on('disconnect', function(){
        console.log('user disconnected');
    })
    socket.on('clicked', function(msg){
        console.log('user-> ' + msg);
    })
    io.emit('broadcast', "i am server nice to meet");
});
    }
}
//module.exports = {};
// module.exports.router = router;
//module.exports.someProperty = 'someValue';