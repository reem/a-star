var AStar = {};

(function (exports) {
  var wrapNode = function (node, pathLength, parent) {
    return {
      node: node,
      pathLength: pathLength,
      parent: parent
    };
  };

  var aStar = function aStar( 
    // => an optimal path from start to goal, as a list of nodes
    start, // The starting planar node.
    goal, // The goal planar node.
    heuristic, // The heuristic for estimating distance to goal.
    neighborDistance // A function for calculating distance between neighbors
  ) {
    var path = [];
    var pathLength = 0;

    var cost = function (wrappedNode) {
      return heuristic(wrappedNode.node, goal) + 
        wrappedNode.pathLength;
    };

    var open = new PriorityQueue(function (a, b) {
      if (cost(a) >= cost(b)) {
        return 1;  
      } else {
        return -1;
      }
    });

    var openSet = new Set.Set();
    open.enq(wrapNode(start, 0, null));
    openSet.insert(start.id);

    var closed = new Set.Set();

    var current;
    while (open.peek().node.id !== goal.id) {
      current = open.deq();
      open.delete(current.id);
      closed.insert(current.node.id);
      var currentCost = cost(current);
      current.node.edges.each(function (neighbor) {
      });
    }
  };

  exports.AStar = aStar;
}(AStar));