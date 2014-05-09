/* globals AStar, d3, console, Post, Graph, Vector, _, window */
var App = {};

(function (exports) {
  var size = 500;
  var source = 0;
  var goal = size - 1;
  var maxEdgeDistance = 80;
  var maxEdges = 10;
  var padding = 50; 

  var init = function () {
    var locations = randomGraphLocations();
    animate(
      mori.take_while(
        notNull,
        mori.iterate(
          stepAStar,
          startAStarState(
            size,
            locations,
            source,
            goal,
            heuristic, // TODO: Implement
            neighborDistance // TODO: Implement
          ))),
      _.partial(animateGraphState, size, locations),
      150);
  };

  exports.init = init;


  var animate = function (animations, animationFunc, time) {
    if (mori.is_empty(animations)) {
      return;
    } else {
      animationFunc(mori.first(animations));
      setTimeout(_.partial(
        animate, mori.rest(animations),
        animationFunc, time));
    }
  };

  var notNull = function (x) { return x !== null; };

  var animateGraphState = function (size, locations, graphState) {
    var d3Ids = d3.selectAll("circle").data(d3.range(size));

    d3Ids.enter().append("circle");

    d3Ids
      .attr("cx", function (id) {
        return locations[id].x;
      })
      .attr("cy", function (id) {
        return locations[id].y;
      })
      .attr("r", function (id) {
        if (graphState.current === id) {
          return 10;
        } else if (graphState.goal === id) {
          return 10;
        } else {
          return 5;
        }
      })
      .style("fill", function (id) {
        if (graphState.current === id) {
          return "orange";
        } else if (mori.has_key(graphState.visited, id)) {
          return "green";
        } else if (graphState.goal === id) {
          return "red";
        } else {
          return "blue";
        }
      });

    d3Ids.exit().remove();
  };

  var startAStarState = function (
      size, locations, start, goal, heuristic, neighborDistance) {
    return new AStarState(
      randomConnectedGraph(size, locations),
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

  var randomGraphLocations = function (size) {
    return d3.range(size).map(function () {
      return new Vector.Vector(
        between(padding, window.innerWidth - padding),
        between(padding, window.innerHeight - padding));
    });
  };

  var randomConnectedGraph = function (size, locations) {
    var connections = pack(size);

    _.times(size, function (id) {
      pack[id] = undefined; // TODO: Implement edges. 
    });

    return function (id) {
      return connections.get(id);
    };
  };

  var between = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var pack = function (length, pack) {
    var results = [];
    for (var i = 0; i < length; i++) {
      results.push(pack);
    }
    return results;
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
}(App));
