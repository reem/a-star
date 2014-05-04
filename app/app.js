/* globals AStar, d3, console, Post, Graph, Vector, _, window */
var App = {};

(function (exports) {
  var svg;

  var init = function () {
    var graph = connectGraph(randomGraph(1000));
    initSvg();
    d3Graph(graph);
    d3Edges(graph);

    Post.register('current', d3Current);
    Post.register('neighbor', d3Neighbor);
    Post.register('graph', d3Graph);

    AStar.greedy(graph, 0, 999);
  };

  exports.init = init;

  var initSvg = function () {
    svg = d3.select("body").append("svg");
  };

  var d3Graph = function (graph) {
    var d3nodes = svg.selectAll("circle")
      .data(graph.nodes.toList());

    d3nodes.enter().append("circle");

    d3nodes
      .attr("cx", function (d) { return d.location.x; })
      .attr("cy", function (d) { return d.location.y; })
      .attr("r",  function (d) {
        if (d.id === 0) {
          return 5;
        } else if (d.id === 999) {
          return 5;
        } else {
          return 5;
        }
      })
      .style("fill", function (d) {
        if (d.id === 999) {
          return "red";
        } else {
          if ('color' in d) {
            return "green";
          }
        }
      });

    d3nodes.exit().remove();
  };

  var d3Edges = function (graph) {
    var edges = new Set.Set();
    graph.nodes.each(function (from) {
      graph.nodes.each(function (to) {
        if (from.edges.contains(to)) {
          edges.insert(new Vector.Vector(from, to));
        }
      });
    });

    var d3edges = svg.selectAll("line")
      .data(edges.toList());

    d3edges.enter().append("line");

    d3edges
      .attr("x1", function (d) {
        return d.x.location.x;
      })
      .attr("y1", function (d) {
        return d.x.location.y;
      })
      .attr("x2", function (d) {
        return d.y.location.x;
      })
      .attr("y2", function (d) {
        return d.y.location.y;
      })
      .style("stroke", "rgb(6,120,155)");

    d3edges.exit().remove();
  };

  var d3Current = function (node) {
    var d3node = svg.select('circle').data([node]);

    d3node.enter().append('circle');

    d3node
      .attr("cx", function (d) {
        return d.location.x;
      })
      .attr("cy", function (d) {
        return d.location.y;
      })
      .attr("r", 10)
      .style("fill", "orange");
  };

  var d3Neighbor = function (neighbor) {
    var d3node = svg.select('circle').data([neighbor]);

    d3node.enter().append('circle');

    d3node
      .attr("cx", function (d) {
        return d.location.x;
      })
      .attr("cy", function (d) {
        return d.location.y;
      })
      .attr("r", 10)
      .style("fill", "green");
  };

  var connectGraph = function (graph) {
    graph.nodes.each(function (from) {
      graph.nodes.each(function (to) {
        if (from.location.distance(to.location) < 50 &&
            from !== to) {
          from.edgeToFrom(to);
        }
      });
    });
    return graph;
  };

  var randomGraph = function (size) {
    var graph = new Graph.Graph();
    _.times(size, function () {
      graph.addNode(new Graph.PlanarNode({
        location: {
          x: (window.innerWidth - 100)  * Math.random() + 50,
          y: (window.innerHeight - 100) * Math.random() + 50,
        }
      }));
    });
    return graph;
  };
}(App));
