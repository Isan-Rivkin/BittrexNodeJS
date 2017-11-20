function weight(rate){
	return Math.log(1/rate);
}
var jsgraphs = require('js-graph-algorithms');
var g = new jsgraphs.WeightedDiGraph(7);
g.addEdge(new jsgraphs.Edge(0, 1, weight(0.05)));
g.addEdge(new jsgraphs.Edge(1, 0, weight(20)));
g.addEdge(new jsgraphs.Edge(0, 2, weight(300)));
//g.addEdge(new jsgraphs.Edge(2, 0, weight(1/300)));
g.addEdge(new jsgraphs.Edge(1, 2, weight(7000)));
//g.addEdge(new jsgraphs.Edge(2, 1, weight(1/7000)));

 
var bf = new jsgraphs.BellmanFord(g, 0);
 
for(var v = 1; v < g.V; ++v){
    if(bf.hasPathTo(v)){
        var path = bf.pathTo(v);
        console.log('=====path from 0 to ' + v + ' start==========');
        for(var i = 0; i < path.length; ++i) {
            var e = path[i];
            console.log(e.from() + ' => ' + e.to() + ': ' + e.weight);
        }
        console.log('=====path from 0 to ' + v + ' end==========');
        console.log('=====distance: '  + bf.distanceTo(v) + '=========');
    }
}