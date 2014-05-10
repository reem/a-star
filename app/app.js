/* globals AStar, d3, console, Post, Graph, Vector, _, window */
var App = {};

(function (exports) {
  var size = 100;
  var source = 0;
  var goal = size - 1;
  var maxEdgeDistance = 100;
  var maxEdges = 10;
  var padding = 50; 

  var svg;

  var init = function () {
    initSvg();
    var locations = randomGraphLocations(size);
    animate(
      mori.take_while(
        notNull,
        mori.iterate(
          stepAStar,
          startAStarState(
            size, // Size
            locations, // Locations array - not passed to a-star
            source, // Start index
            goal, // Goal index
            function (self) { // Heuristic
              return locations[self].distance(locations[goal]);
            },
            function (self, other) { // Neighbor Distance
              return locations[self].distance(locations[other]);
            }
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
    var d3Ids = svg.selectAll("circle").data(d3.range(size));

    d3Ids.enter().append("circle");

    d3Ids
      .transition()
      .duration(100)
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
          return "black";
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

  var stepAStar = function (state) {
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
      connections[id] = edgesFrom(id, locations);
    });

    return function (id) {
      return connections.get(id);
    };
  };

  var edgesFrom = function (id, locations) {
    var fromLocation = locations[id];
    return _.reduce(locations, function (memo, location, otherId) {
      return fromLocation.distance(location) < maxEdgeDistance ?
        mori.conj(memo, otherId) :
        memo;        
    }, mori.set());
  };

  var initSvg = function () {
    svg = d3.select("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight);
  };

  var between = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };

  var pack = function (length, packer) {
    var results = [];
    for (var i = 0; i < length; i++) {
      results.push(packer);
    }
    return results;
  };
}(App));
