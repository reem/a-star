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
      if (!(openSet.contains(current.id))) { continue; }
      openSet.remove(current.id);

      closed.insert(current.node.id);
      var currentCost = cost(current);
      
      current.node.edges.each(function (neighbor) {
        var neighborCost = currentCost + 
          neighborDistance(current.node, neighbor);
          
        if (openSet.contains(neighbor.id) && 
            currentCost < neighborCost) {
          openSet.remove(neighbor.id);
        } else if (closed.contains(neighbor.id) &&
                   currentCost < neighborCost) {
          closed.remove(neighbor.id);
        } else if (!openSet.contains(neighbor.id) &&
                   !closed.contains(neighbor.id)) {
          open.enq(wrappedNode(neighbor, neighborCost, current));
        }
      });
    }

    var path = [];
    var back = open.deq();
    while (back !== null) {
      path.push(back);
      back = back.parent;
    }
    path.reverse();
    return path;
  };

  exports.AStar = aStar;
}(AStar));