/* globals Post*/
var AStar = {};

(function (exports) {
  var wrapNode = function (node, pathLength, parent) {
    return {
      node: node,
      pathLength: pathLength,
      parent: parent
    };
  };

  var BFS = function BFS(graph, startIndex, goalIndex) {
    var nodes = graph.nodes.toList();
    var start = nodes[startIndex];
    var goal = nodes[goalIndex];

    var queue = {storage: {}, low: 0, high: 0};
    queue.push = function (val) {
      this.storage[this.high++] = val;
    };
    queue.pop = function (val) {
      return this.storage[this.low++];
    };

    queue.push(start);

    while(queue.storage[queue.low] !== goal) {
      var current = queue.pop();
      Post.post('current', current);
      current.edges.each(function (neighbor) {
        Post.post('neighbor', neighbor);
        queue.push(neighbor);
      });
    }
    Post.post('current', queue.pop());
  };
  exports.BFS = BFS;

//  var aStar = function aStar(
//    // => an optimal path from start to goal, as a list of nodes
//    start, // The starting planar node.
//    goal, // The goal planar node.
//    heuristic, // The heuristic for estimating distance to goal.
//    neighborDistance // A function for calculating distance between neighbors
//  ) {
//    var cost = function (wrappedNode) {
//      return heuristic(wrappedNode.node, goal) +
//        wrappedNode.pathLength;
//    };
//
//    var open = new PriorityQueue(function (a, b) {
//      if (cost(a) >= cost(b)) {
//        return 1;
//      } else {
//        return -1;
//      }
//    });
//
//    var openSet = new Set.Set();
//    open.enq(wrapNode(start, 0, null));
//    openSet.insert(start.id);
//
//    var closed = new Set.Set();
//
//    var current;
//    while (open.peek().node.id !== goal.id) {
//
//      current = open.deq();
//      if (!(openSet.contains(current.node.id))) {
//        continue;
//      }
//      openSet.remove(current.node.id);
//
//      closed.insert(current.node.id);
//      var currentCost = cost(current);
//
//      current.node.edges.each(function (neighbor) {
//        var neighborCost = currentCost +
//          neighborDistance(current.node, neighbor);
//
//        if (openSet.contains(neighbor.id) &&
//          currentCost < neighborCost) {
//          openSet.remove(neighbor.id);
//        } else if (!openSet.contains(neighbor.id) &&
//          !closed.contains(neighbor.id)) {
//          open.enq(wrapNode(neighbor, neighborCost, current));
//          openSet.insert(neighbor);
//        }
//      });
//    }
//
//    var path = [];
//    var back = open.deq();
//    while (back !== null) {
//      path.push(back);
//      back = back.parent;
//    }
//    path.reverse();
//    return path;
//  };
//
//  exports.aStar = aStar;
}(AStar));
