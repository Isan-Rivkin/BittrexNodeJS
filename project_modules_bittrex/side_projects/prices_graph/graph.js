
var bittrex = require('../../../bittrex_api/bittrex_api');
var bf = require("bellmanford");


function findAllEdgesOf(node,edges_list){
    var neighbours = [];
    edges_list.forEach(edge=>{
        if(edge.base == node || edge.coin == node){
            neighbours.push(edge);
        }
    });
    return neighbours;

}


function buildEdges(edgeMap,nodeArray,coin_nodes,rates_list,weightFunction,callback){
    var neighbours = []
    neighbours.push({source:'ETH',neighbours:findAllEdgesOf('ETH',rates_list)});
    neighbours.push({source:'BTC',neighbours:findAllEdgesOf('BTC',rates_list)});
    neighbours.push({source:'USDT',neighbours:findAllEdgesOf('USDT',rates_list)});
    callback(neighbours);
}

function buildGraph(nodes,rates_list,callback){
    var nodeList = new bf.NodeList();

    let myListNodes = Array.from(nodes);
    for (var i = 0; i < myListNodes.length; i++) {
        nodeList.addNode(new bf.Node());
    }
    var nodeArray = nodeList.toArray();
     var edgeMap = new bf.EdgeMap(nodeList);
    buildEdges(edgeMap,nodeArray,nodes,rates_list,0,function(all_edges){
        all_edges.forEach(family=>{
            console.log('############# edges of : ##############' + family.source );
            console.log(family.neighbours);
        });
    });
    // edgeMap.setEdge(nodeArray[0], nodeArray[1], 1);
}


var shortestPathFrom = function(){
    bittrex.getAllTickers(function(nodes,rates_list){
        buildGraph(nodes,rates_list,function(){});
    });
}

shortestPathFrom();

//
// var nodeList = new bf.NodeList();
//
//
// for (var i = 0; i < 3; i++) {
//     nodeList.addNode(new bf.Node());
// }
//
// var nodeArray = nodeList.toArray();
//
// var edgeMap = new bf.EdgeMap(nodeList);
// edgeMap.setEdge(nodeArray[1], nodeArray[0], 1);
// edgeMap.setEdge(nodeArray[2], nodeArray[0], 2);
// edgeMap.setEdge(nodeArray[2], nodeArray[1], 0);

// edgeMap.setEdge(nodeArray[0], nodeArray[1], 3);
// edgeMap.setEdge(nodeArray[0], nodeArray[2], 2);
// edgeMap.setEdge(nodeArray[0], nodeArray[3], 5);
//
// edgeMap.setEdge(nodeArray[1], nodeArray[3], 1);
// edgeMap.setEdge(nodeArray[1], nodeArray[4], 4);
//
// edgeMap.setEdge(nodeArray[2], nodeArray[3], 2);
// edgeMap.setEdge(nodeArray[2], nodeArray[5], 1);
//
// edgeMap.setEdge(nodeArray[3], nodeArray[4], 3);
//
// edgeMap.setEdge(nodeArray[4], nodeArray[5], 2);
//
// var graph = new bf.Graph(nodeList, edgeMap);
//
// var shortestPaths = graph.getShortestPathsSync(nodeArray[0]);
// console.log(JSON.stringify(shortestPaths,null,2));