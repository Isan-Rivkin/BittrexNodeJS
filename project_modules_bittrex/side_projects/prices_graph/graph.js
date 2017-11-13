var nodes = [
    {
        links: [ 1 ], // node 0 is linked to node 1
        visited: false
    }, 
    {
        links: [ 0, 2 ], // node 1 is linked to node 0 and 2
        path: [],
        visited: false
    },
   	{
        links: [ 0, 3 ], // node 1 is linked to node 0 and 2
        path: [],
        visited: false
    },
    {
        links: [ 1], // node 1 is linked to node 0 and 2
        path: [],
        visited: false
    }
 ];



function bfs( start ) {
    var listToExplore = [ start ];

    nodes[ start ].visited = true;

    while ( listToExplore.length > 0 ) {
        var nodeIndex = listToExplore.shift();
        nodes[ nodeIndex ].links.forEach( function( childIndex ) {
            if ( !nodes[ childIndex ].visited ) {
                nodes[ childIndex ].visited = true;
                listToExplore.push( childIndex );
                console.log(childIndex);
            }
        } );
    }
};

 bfs( 0 );

// var PF = require('pathfinding');
// var matrix = [
//     [0, 0, 0, 1, 0],
//     [1, 0, 0, 0, 1],
//     [0, 0, 1, 0, 0],
// ];

// var grid = new PF.Grid(matrix);

// var finder = new PF.AStarFinder() ;


// var path = finder.findPath(1, 2, 4, 2, grid);	
// //var path = finder.findPath(1, 1, 2, 1, grid);	
// console.log(path);
// //[ [ 1, 2 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ], [ 3, 2 ], [ 4, 2 ] ]
