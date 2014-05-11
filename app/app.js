/* globals mori, d3, console, Vector, _, window, setTimeout */
var App = {};

(function (exports) {
  var m = mori;

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
      m.take_while(
        notDone,
        m.iterate(
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
      _.partial(animateGraphState, size, locations, 
        function (n) { return n === goal; }), // Animator
      150
    ); // Wait time
  };

  exports.init = init;

  var animate = function (animations, animationFunc, time) {
    if (!m.first(animations)) {
      return;
    } else {
      animationFunc(m.first(animations));
      setTimeout(function animateNext() {
        animate(m.rest(animations),
        animationFunc, time);
      });
    }
  };

  var notDone = function (x) {
    return x !== null && x.end === null;
  };

  var animateGraphState = function (size, locations, goal, graphState) {
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
        } else if (goal(id)) {
          return 10;
        } else {
          return 5;
        }
      })
      .style("fill", function (id) {
        if (graphState.current === id) {
          return "orange";
        } else if (m.has_key(graphState.closed, id)) {
          return "green";
        } else if (goal(id)) {
          return "red";
        } else {
          return "black";
        }
      });

    d3Ids.exit().remove();
  };

  var runAStar = function (graph, start, goal, heuristic,
    neighborDistance) {

    var expand = function (current, state, next) {
      var cost = m.find(state.score, current) + 
      neighborDistance(current, next);
      if (m.find(state.open, next)) {
        if (cost < m.find(state.score, next)) {
          return link(current, next, cost, state);
        } else {
          return state;
        }
      } else {
        return link(current, next, cost, state);
      }
    };

    var link = function (current, next, cost, state) {
      return recordUpdate(state, {
        cameFrom: m.assoc(state.cameFrom, next, current),
        score: m.assoc(state.score, next, cost),
        open: m.conj(state.open, next)
      });
    };

    return function (state) {
      var current = m.first(state.open);
      if (current) {
        if (goal(current)) {
          return recordUpdate(state, {end: current});
        } else {
          return m.reduce(
            _.partial(expand, current),
            recordUpdate(state, {open:    m.disj(state.open, current),
                                 closed: m.conj(state.closed, current)}),
            mori.difference(graph(current), state.closed)
          );
        }
      } else {
        return null;
      }
    };
  };

  var recordUpdate = function (obj, pairs) {
    var newObj = _.extend({}, obj);
    _.each(pairs, function (val, key) {
      newObj[key] = val;
    });
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
      visited: m.set([start]),
      score: m.hash_map([start, 0]),
      open: m.sorted_set([start]),
      closed: m.set(),
      cameFrom: m.hash_map([start, null]),
      path: m.vector(),
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

    return function graph (id) {
      return connections[id];
    };
  };

  var edgesFrom = function (id, locations) {
    var fromLocation = locations[id];
    return _.reduce(locations, function (memo, location, otherId) {
      return fromLocation.distance(location) < maxEdgeDistance ?
        m.conj(memo, otherId) :
        memo;
    }, m.set());
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
