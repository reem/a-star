var Graph = {};

(function (exports) {
  var nextId = 0; // A 'global' counter to all node instances to generate unique ids for all of them.

  var Node = function NodeConstructor(config) {
    this.value = config.value || null;
    this.edges = config.edges || new Set.Set();
    this.id = nextId++; // Get the next id.
  };

  Node.prototype.edgeTo = function EdgeTo(to) {
    this.edges.insert(to);
  };

  Node.prototype.edgeFrom = function EdgeFrom(from) {
    from.edges.insert(this);
  };

  Node.prototype.edgeToFrom = function EdgeToFrom(other) {
    this.edgeTo(other);
    this.edgeFrom(other);
  };

  exports.Node = Node;

  var PlanarNode = function PlanarNodeConstructor(config) {
    Node.call(this, config);
    this.location = new Vector.Vector(config.location.x, config.location.y);
  };

  PlanarNode.prototype.distance = function PlanarNodeDistance(other) {
    return this.location.distance(other.location);
  };

  exports.PlanarNode = PlanarNode;
}(Graph));