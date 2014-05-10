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
    animate( // While not done animate a-star
      mori.take_while(
        notDone,
        mori.iterate(
          stepAStar, // Steps the algorithm
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
      _.partial(animateGraphState, size, locations), // Animator
      150); // Wait time
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

  var notDone = function (x) { 
    return x !== null && x.end !== null; 
  };

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
      start, mori.set(), mori.sorted_set(), mori.set(),
      mori.hash_map(), mori.vector()
    );
  };

  var stepAStar = function (state) {
    if (mori.first(state.open)) {
      if (mori.first(state.open) === goal) {
        return recordUpdate(state, 'end', mori.first(state.open));
      } else {
        // magic
      }
    } else {
      return null;
    }
  };

  var recordUpdate = function (obj, key, val) {
    var newObj = _.extend({}, obj);
    newObj[key] = val;
    return newObj;
  };

  var AStarState = function (
      graph, start, goal, heuristic,
      neighborDistance, current, visited, 
      open, closed, cameFrom, path, end) {
    this.graph = graph; // id -> edges
    this.start = start; // id of the start node
    this.goal = goal; // id of the end node
    this.heuristic = heuristic; // the heuristic function
    this.neighborDistance = neighborDistance;
    this.current = current;
    this.visited = visited; // set of visited nodes.
    this.open = open;
    this.closed = closed;
    this.cameFrom = cameFrom;
    this.path = path;
    this.end = end || null;
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
