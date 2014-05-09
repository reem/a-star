/* globals AStar, d3, console, Post, Graph, Vector, _, window */
var App = {};

(function (exports) {
  var size = 500;
  var source = 0;
  var goal = size - 1;
  var maxEdgeDistance = 80;
  var maxEdges = 10;

  var init = function () {
    animate(
      mori.take_while(
        notNull,
        mori.iterate(
          stepAStar,
          startAStarState(
            size,
            source,
            goal,
            heuristic, // TODO: Implement
            neighborDistance // TODO: Implement
          ))),
      _.partial(animateGraphState, size),
      150);

    //AStar.greedy(graph, source, goal, eventer);
    AStar.BFS(graph, source, goal, eventer);
    //AStar.DFS(graph, source, goal, eventer);
  };

  exports.init = init;


  var animate = function (animations, animationFunc, time) {
    if (mori.is_empty(animations)) {
      return;
    } else {
      animationFunc(mori.first(animations));
      setTimeout(_.partial(animate,
                          mori.rest(animations),
                          animationFunc,
                          time));
    }
  };

  var notNull = function (x) { return x !== null; };

  var animateGraphState = function (size, graphState) {

  };

  var startAStarState = function (
      size, start, goal, heuristic, neighborDistance) {
    return new AStarState(
      randomConnectedGraph(size),
      start, goal, heuristic, neighborDistance,
      mori.sorted_set(), mori.set()
    );
  };

  var stepAStar = function () {

  };

  var AStarState = function (
      graph, start, goal, heuristic,
      neighborDistance, current, visited) {
    this.graph = graph;
    this.start = start;
    this.goal = goal;
    this.heuristic = heuristic;
    this.neighborDistance = neighborDistance;
    this.visited = visited;
  };

//   var d3Graph = function (graph) {
//     var d3nodes = svg.selectAll("circle")
//       .data(graph.nodes.toList());

//     d3nodes.enter().append("circle");

//     d3nodes
//       .attr("cx", function (d) { return d.location.x; })
//       .attr("cy", function (d) { return d.location.y; })
//       .attr("r",  function (d) {
//         if (d.id === source) {
//           return 10;
//         } else if (d.id === goal) {
//           return 10;
//         } else if (d.current) {
//           return 10;
//         } else {
//           return 5;
//         }
//       })
//       .style("fill", function (d) {
//         if (d.id === goal) {
//           if (d.current)
//             return "blue";
//           else
//             return "red";
//         } else {
//           if (d.current) {
//             return "orange";
//           } else if (d.onPath) {
//             return "blue";
//           } else if (d.visited) {
//             return "orange";
//           } else {
//             return "black";
//           }
//         }
//       });

//     d3nodes.exit().remove();
//   };

//   var d3Edges = function (graph) {
//     var edges = new Set.Set();
//     graph.nodes.each(function (from) {
//       graph.nodes.each(function (to) {
//         if (from.edges.contains(to)) {
//           edges.insert(new Vector.Vector(from, to));
//         }
//       });
//     });

//     var d3edges = svg.selectAll("line")
//       .data(edges.toList());

//     d3edges.enter().append("line");

//     d3edges
//       .attr("x1", function (d) {
//         return d.x.location.x;
//       })
//       .attr("y1", function (d) {
//         return d.x.location.y;
//       })
//       .attr("x2", function (d) {
//         return d.y.location.x;
//       })
//       .attr("y2", function (d) {
//         return d.y.location.y;
//       })
//       .style("stroke", "rgb(6,120,155)");

//     d3edges.exit().remove();
//   };

//   var connectGraph = function (graph) {
//     graph.nodes.each(function (from) {
//       graph.nodes.each(function (to) {
//         if (from.location.distance(to.location) < maxEdgeDistance &&
//             from !== to && from.edges.length < maxEdges &&
//             to.edges.length < maxEdges) {
//           from.edgeToFrom(to);
//         }
//       });
//     });
//     return graph;
//   };

//   var randomGraph = function (size) {
//     var graph = new Graph.Graph();
//     _.times(size, function () {
//       graph.addNode(new Graph.PlanarNode({
//         location: {
//           x: (window.innerWidth - 100)  * Math.random() + 50,
//           y: (window.innerHeight - 100) * Math.random() + 50,
//         }
//       }));
//     });
//     return graph;
//   };
// }(App));
