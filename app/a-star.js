/* globals Post, console*/
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

    var color = function (node) { node.color = true; };

    var queue = {storage: {}, low: 0, high: 0};
    queue.push = function (val) {
      this.storage[this.high++] = val;
    };
    queue.pop = function (val) {
      return this.storage[this.low++];
    };
    queue.peek = function () {
      return this.storage[this.low];
    };
    queue.size = function () {
      return this.high - this.low;
    };

    queue.push(start);
    var inQueue = new Set.Set();
    inQueue.insert(start);

    var timer = setInterval(function () {
      if (queue.peek() === goal) {
        clearInterval(timer);
        Post.post('current', queue.pop());
        return;
      } else {
        var current = queue.pop();
        inQueue.remove(current);
        color(current);
        Post.post('current', current);
        Post.post('graph', graph);
        current.edges.each(function (neighbor) {
          if (!('color' in neighbor)) {
            Post.post('neighbor', neighbor);
            if (!(inQueue.contains(neighbor))) {
              queue.push(neighbor);
              inQueue.insert(neighbor);
            }
          }
        });
      }
    }, 100);
  };

  exports.BFS = BFS;

  var greedy = function greedy(graph, startIndex, goalIndex) {
    var nodes = graph.nodes.toList();
    var current = nodes[startIndex];
    var goal = nodes[goalIndex];

    var timer = setInterval(function () {
      if (current === goal) {
        clearInterval(timer);
        Post.post('current', current);
      } else {
        var neighbors = current.edges.toList();
        var next = neighbors[0];
        for (var i = 1; i < neighbors.length; i++) {
          var neighbor = neighbors[i];
          if ('color' in neighbor) {
            continue;
          }
          if (goal.location.distance(neighbor.location) < goal.location.distance(next.location)) {
            next = neighbor;
          }
        }
        current = next;
        current.color = true;
        Post.post('graph', graph);
        Post.post('current', current);
      }
    }, 500);
  };

  exports.greedy = greedy;

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
