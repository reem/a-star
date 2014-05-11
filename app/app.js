/* globals mori, d3, console, Vector, _, window, setTimeout */
var App = {};

(function (exports) {
  var size = 100;
  var start = 0;
  var goal = size - 1;
  var maxEdgeDistance = 100;
  var maxEdges = 10;
  var padding = 50;

  var svg;
  var init = function () {
    svg = d3.select("svg")
      .attr("width", window.innerWidth)
      .attr("height", window.innerHeight);

    var locations = randomGraphLocations(size);
    animate( // While not done animate a-star
      mori.take_while(
        notDone,
        mori.iterate(
          runAStar(
            randomConnectedGraph(size, locations),
            start,
            function (n) {
              return n === goal;
            },
            function (self) { // Heuristic
              return locations[self].distance(locations[goal]);
            },
            function (self, other) { // Neighbor Distance
              return locations[self].distance(locations[other]);
            }
          ),
          initAStarState(start)
        )
      ),
      _.partial(animateGraphState, size, locations), // Animator
      150
    ); // Wait time
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
    return x !== null && x.end === null;
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

  var runAStar = function (graph, start, goal, heuristic,
    neighborDistance) {
    return function (state) {
      if (mori.first(state.open)) {
        if (goal(mori.first(state.open))) {
          return recordUpdate(state, {end: mori.first(state.open)});
        } else {
          return state;
        }
      } else {
        return null;
      }
    };
  };

  var recordUpdate = function (obj, pairs) {
    var newObj = _.extend({}, obj);
    newObj[key] = val;
    return newObj;
  };

  var AStarState = function (config) {
    this.current = config.current;
    this.visited = config.visited; // set of visited nodes.
    this.score = config.score;
    this.open = config.open;
    this.closed = config.closed;
    this.cameFrom = config.cameFrom;
    this.path = config.path;
    this.end = config.end;
  };

  var initAStarState = function (start) {
    return new AStarState({
      current: start,
      visited: mori.set([start]),
      score: mori.hash_map([start, 0]),
      open: mori.sorted_set([start]),
      closed: mori.set(),
      cameFrom: mori.hash_map([start, null]),
      path: mori.vector(),
      end: null
    });
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

  var initSvg = function () {};

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
