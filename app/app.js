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
}(App));
