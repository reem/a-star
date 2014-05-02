var App = {};

(function (exports) {
  var svg;

  var init = function () {
    initSvg();
    d3Graph(randomGraph(100));
  };

  exports.init = init;

  var initSvg = function () {
    svg = d3.select("body").append("svg");
  };

  var d3Graph = function (graph) {
    console.log(graph.nodes.toList());
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

  var d3Current = function (node) {

  };

  var d3Neighbor = function (neighbors) {

  };

  var d3CurrentNeighbor = function (currentNieghbor) {

  };

  var randomGraph = function (size) {
    var graph = new Graph.Graph();
    _.times(size, function () {
      console.log(graph.nodes);
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