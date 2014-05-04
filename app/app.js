var App = {};

(function (exports) {
  var svg;

  var init = function () {
    var graph = connectGraph(randomGraph(10));
    initSvg();
    d3Graph(graph);
    d3Edges(graph);
    var start = graph.nodes.toList()[0];
    var end = graph.nodes.toList()[9];
    console.log(AStar.aStar(start, end, 
      function (node) {
        return node.location.distance(end.location);
      },
      function (node, other) {
        return node.location.distance(other.location);
      }));
  };

  exports.init = init;

  var initSvg = function () {
    svg = d3.select("body").append("svg");
  };

  var d3Graph = function (graph) {
    var d3nodes = svg.selectAll("circle")
      .data(graph.nodes.toList());

    d3nodes.enter().append("circle")
      .attr("cx", function (d) { return d.location.x; })
      .attr("cy", function (d) { return d.location.y; })
      .attr("r", 4);

    d3nodes
      .attr("cx", function (d) { return d.location.x; })
      .attr("cy", function (d) { return d.location.y; })
      .attr("r", 4);

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

  };

  var d3Neighbor = function (neighbors) {

  };

  var d3CurrentNeighbor = function (currentNieghbor) {

  };

  var connectGraph = function (graph) {
    graph.nodes.each(function (from) {
      graph.nodes.each(function (to) {
        if (from.location.distance(to.location) < 400 &&
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
          x: (window.innerWidth - 10)  * Math.random() + 10,
          y: (window.innerHeight - 10) * Math.random() + 10,
        } 
      }));
    });
    return graph;
  };
}(App));