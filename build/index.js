// node_modules/collider2d/collider2d.js
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0;i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor)
      descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps)
    _defineProperties(Constructor.prototype, protoProps);
  if (staticProps)
    _defineProperties(Constructor, staticProps);
  return Constructor;
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var Vector = /* @__PURE__ */ function() {
  function Vector2() {
    var x = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _classCallCheck(this, Vector2);
    _defineProperty(this, "_x", 0);
    _defineProperty(this, "_y", 0);
    this._x = x;
    this._y = y;
  }
  _createClass(Vector2, [{
    key: "x",
    get: function get() {
      return this._x;
    },
    set: function set(x) {
      this._x = x;
    }
  }, {
    key: "y",
    get: function get() {
      return this._y;
    },
    set: function set(y) {
      this._y = y;
    }
  }, {
    key: "copy",
    value: function copy(other) {
      this._x = other.x;
      this._y = other.y;
      return this;
    }
  }, {
    key: "clone",
    value: function clone() {
      return new Vector2(this.x, this.y);
    }
  }, {
    key: "perp",
    value: function perp() {
      var x = this.x;
      this._x = this.y;
      this._y = -x;
      return this;
    }
  }, {
    key: "rotate",
    value: function rotate(angle) {
      var x = this.x;
      var y = this.y;
      this._x = x * Math.cos(angle) - y * Math.sin(angle);
      this._y = x * Math.sin(angle) + y * Math.cos(angle);
      return this;
    }
  }, {
    key: "reverse",
    value: function reverse() {
      this._x = -this.x;
      this._y = -this.y;
      return this;
    }
  }, {
    key: "normalize",
    value: function normalize() {
      var d = this.len();
      if (d > 0) {
        this._x = this.x / d;
        this._y = this.y / d;
      }
      return this;
    }
  }, {
    key: "add",
    value: function add(other) {
      this._x += other.x;
      this._y += other.y;
      return this;
    }
  }, {
    key: "sub",
    value: function sub(other) {
      this._x -= other.x;
      this._y -= other.y;
      return this;
    }
  }, {
    key: "scale",
    value: function scale(x, y) {
      this._x *= x;
      this._y *= typeof y != "undefined" ? y : x;
      return this;
    }
  }, {
    key: "project",
    value: function project(other) {
      var amt = this.dot(other) / other.len2();
      this._x = amt * other.x;
      this._y = amt * other.y;
      return this;
    }
  }, {
    key: "projectN",
    value: function projectN(other) {
      var amt = this.dot(other);
      this._x = amt * other.x;
      this._y = amt * other.y;
      return this;
    }
  }, {
    key: "reflect",
    value: function reflect(axis) {
      var x = this.x;
      var y = this.y;
      this.project(axis).scale(2);
      this._x -= x;
      this._y -= y;
      return this;
    }
  }, {
    key: "reflectN",
    value: function reflectN(axis) {
      var x = this.x;
      var y = this.y;
      this.projectN(axis).scale(2);
      this._x -= x;
      this._y -= y;
      return this;
    }
  }, {
    key: "dot",
    value: function dot(other) {
      return this.x * other.x + this.y * other.y;
    }
  }, {
    key: "len2",
    value: function len2() {
      return this.dot(this);
    }
  }, {
    key: "len",
    value: function len() {
      return Math.sqrt(this.len2());
    }
  }]);
  return Vector2;
}();
var Polygon = /* @__PURE__ */ function() {
  function Polygon2() {
    var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector;
    var points = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
    _classCallCheck(this, Polygon2);
    _defineProperty(this, "_position", new Vector);
    _defineProperty(this, "_points", []);
    _defineProperty(this, "_pointsGeneric", []);
    _defineProperty(this, "_angle", 0);
    _defineProperty(this, "_offset", new Vector);
    _defineProperty(this, "_calcPoints", []);
    _defineProperty(this, "_edges", []);
    _defineProperty(this, "_normals", []);
    this._position = position;
    this.setPoints(points);
  }
  _createClass(Polygon2, [{
    key: "position",
    get: function get() {
      return this._position;
    }
  }, {
    key: "points",
    get: function get() {
      return this._points;
    }
  }, {
    key: "pointsGeneric",
    get: function get() {
      return this._pointsGeneric;
    }
  }, {
    key: "calcPoints",
    get: function get() {
      return this._calcPoints;
    }
  }, {
    key: "offset",
    get: function get() {
      return this._offset;
    }
  }, {
    key: "angle",
    get: function get() {
      return this._angle;
    }
  }, {
    key: "edges",
    get: function get() {
      return this._edges;
    }
  }, {
    key: "normals",
    get: function get() {
      return this._normals;
    }
  }, {
    key: "setPoints",
    value: function setPoints(points) {
      var lengthChanged = !this.points || this.points.length !== points.length;
      if (lengthChanged) {
        var i;
        var calcPoints = this._calcPoints = [];
        var edges = this._edges = [];
        var normals = this._normals = [];
        for (i = 0;i < points.length; i++) {
          var p1 = points[i];
          var p2 = i < points.length - 1 ? points[i + 1] : points[0];
          this._pointsGeneric.push(points[i].x, points[i].y);
          if (p1 !== p2 && p1.x === p2.x && p1.y === p2.y) {
            points.splice(i, 1);
            i -= 1;
            continue;
          }
          calcPoints.push(new Vector);
          edges.push(new Vector);
          normals.push(new Vector);
        }
      }
      this._points = points;
      this._recalc();
      return this;
    }
  }, {
    key: "setAngle",
    value: function setAngle(angle) {
      this._angle = angle;
      this._recalc();
      return this;
    }
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      this._offset = offset;
      this._recalc();
      return this;
    }
  }, {
    key: "rotate",
    value: function rotate(angle) {
      var points = this.points;
      var len = points.length;
      for (var i = 0;i < len; i++) {
        points[i].rotate(angle);
      }
      this._recalc();
      return this;
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      var points = this.points;
      var len = points.length;
      for (var i = 0;i < len; i++) {
        points[i].x += x;
        points[i].y += y;
      }
      this._recalc();
      return this;
    }
  }, {
    key: "_recalc",
    value: function _recalc() {
      var calcPoints = this.calcPoints;
      var edges = this._edges;
      var normals = this._normals;
      var points = this.points;
      var offset = this.offset;
      var angle = this.angle;
      var len = points.length;
      var i;
      for (i = 0;i < len; i++) {
        var calcPoint = calcPoints[i].copy(points[i]);
        calcPoint.x += offset.x;
        calcPoint.y += offset.y;
        if (angle !== 0)
          calcPoint.rotate(angle);
      }
      for (i = 0;i < len; i++) {
        var p1 = calcPoints[i];
        var p2 = i < len - 1 ? calcPoints[i + 1] : calcPoints[0];
        var e = edges[i].copy(p2).sub(p1);
        normals[i].copy(e).perp().normalize();
      }
      return this;
    }
  }, {
    key: "getAABB",
    value: function getAABB() {
      var points = this.calcPoints;
      var len = points.length;
      var xMin = points[0].x;
      var yMin = points[0].y;
      var xMax = points[0].x;
      var yMax = points[0].y;
      for (var i = 1;i < len; i++) {
        var point = points[i];
        if (point["x"] < xMin)
          xMin = point["x"];
        else if (point["x"] > xMax)
          xMax = point["x"];
        if (point["y"] < yMin)
          yMin = point["y"];
        else if (point["y"] > yMax)
          yMax = point["y"];
      }
      return new Polygon2(this._position.clone().add(new Vector(xMin, yMin)), [new Vector, new Vector(xMax - xMin, 0), new Vector(xMax - xMin, yMax - yMin), new Vector(0, yMax - yMin)]);
    }
  }, {
    key: "getCentroid",
    value: function getCentroid() {
      var points = this.calcPoints;
      var len = points.length;
      var cx = 0;
      var cy = 0;
      var ar = 0;
      for (var i = 0;i < len; i++) {
        var p1 = points[i];
        var p2 = i === len - 1 ? points[0] : points[i + 1];
        var a = p1["x"] * p2["y"] - p2["x"] * p1["y"];
        cx += (p1["x"] + p2["x"]) * a;
        cy += (p1["y"] + p2["y"]) * a;
        ar += a;
      }
      ar = ar * 3;
      cx = cx / ar;
      cy = cy / ar;
      return new Vector(cx, cy);
    }
  }]);
  return Polygon2;
}();
var Box = /* @__PURE__ */ function() {
  function Box2() {
    var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector;
    var width = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    var height = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    _classCallCheck(this, Box2);
    _defineProperty(this, "_position", new Vector);
    _defineProperty(this, "_width", 0);
    _defineProperty(this, "_height", 0);
    this._position = position;
    this._width = width;
    this._height = height;
  }
  _createClass(Box2, [{
    key: "toPolygon",
    value: function toPolygon() {
      return new Polygon(new Vector(this._position.x, this._position.y), [new Vector, new Vector(this._width, 0), new Vector(this._width, this._height), new Vector(0, this._height)]);
    }
  }]);
  return Box2;
}();
var Circle = /* @__PURE__ */ function() {
  function Circle2() {
    var position = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : new Vector;
    var radius = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
    _classCallCheck(this, Circle2);
    _defineProperty(this, "_position", new Vector);
    _defineProperty(this, "_radius", 0);
    _defineProperty(this, "_offset", new Vector);
    this._position = position;
    this._radius = radius;
  }
  _createClass(Circle2, [{
    key: "position",
    get: function get() {
      return this._position;
    }
  }, {
    key: "radius",
    get: function get() {
      return this._radius;
    }
  }, {
    key: "offset",
    get: function get() {
      return this._offset;
    },
    set: function set(offset) {
      this._offset = offset;
    }
  }, {
    key: "translate",
    value: function translate(x, y) {
      this._position.x += x;
      this._position.y += y;
    }
  }, {
    key: "getAABB",
    value: function getAABB() {
      var corner = this._position.clone().add(this._offset).sub(new Vector(this._radius, this._radius));
      return new Box(corner, this._radius * 2, this._radius * 2).toPolygon();
    }
  }, {
    key: "setOffset",
    value: function setOffset(offset) {
      this._offset = offset;
      return this;
    }
  }]);
  return Circle2;
}();
var CollisionDetails = /* @__PURE__ */ function() {
  function CollisionDetails2() {
    _classCallCheck(this, CollisionDetails2);
    _defineProperty(this, "a", undefined);
    _defineProperty(this, "b", undefined);
    _defineProperty(this, "overlapN", new Vector);
    _defineProperty(this, "overlapV", new Vector);
    _defineProperty(this, "overlap", Number.MAX_VALUE);
    _defineProperty(this, "aInB", true);
    _defineProperty(this, "bInA", true);
    this.clear();
  }
  _createClass(CollisionDetails2, [{
    key: "clear",
    value: function clear() {
      this.aInB = true;
      this.bInA = true;
      this.overlap = Number.MAX_VALUE;
      return this;
    }
  }]);
  return CollisionDetails2;
}();
var Collider2D = /* @__PURE__ */ function() {
  function Collider2D2() {
    _classCallCheck(this, Collider2D2);
    _defineProperty(this, "_T_VECTORS", []);
    _defineProperty(this, "_T_ARRAYS", []);
    _defineProperty(this, "_T_COLLISION_DETAILS", new CollisionDetails);
    _defineProperty(this, "_TEST_POINT", new Box(new Vector, 0.000001, 0.000001).toPolygon());
    _defineProperty(this, "_LEFT_VORONOI_REGION", -1);
    _defineProperty(this, "_MIDDLE_VORONOI_REGION", 0);
    _defineProperty(this, "_RIGHT_VORONOI_REGION", 1);
    for (var i = 0;i < 10; i++) {
      this._T_VECTORS.push(new Vector);
    }
    for (var _i = 0;_i < 5; _i++) {
      this._T_ARRAYS.push([]);
    }
  }
  _createClass(Collider2D2, [{
    key: "pointInCircle",
    value: function pointInCircle(point, circle) {
      var differenceV = this._T_VECTORS.pop().copy(point).sub(circle.position).sub(circle.offset);
      var radiusSq = circle.radius * circle.radius;
      var distanceSq = differenceV.len2();
      this._T_VECTORS.push(differenceV);
      return distanceSq <= radiusSq;
    }
  }, {
    key: "pointInPolygon",
    value: function pointInPolygon(point, polygon) {
      this._TEST_POINT.position.copy(point);
      this._T_COLLISION_DETAILS.clear();
      var result = this.testPolygonPolygon(this._TEST_POINT, polygon, true);
      if (result)
        result = this._T_COLLISION_DETAILS.aInB;
      return result;
    }
  }, {
    key: "testCircleCircle",
    value: function testCircleCircle(a, b) {
      var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var differenceV = this._T_VECTORS.pop().copy(b.position).add(b.offset).sub(a.position).sub(a.offset);
      var totalRadius = a.radius + b.radius;
      var totalRadiusSq = totalRadius * totalRadius;
      var distanceSq = differenceV.len2();
      if (distanceSq > totalRadiusSq) {
        this._T_VECTORS.push(differenceV);
        return false;
      }
      if (details) {
        this._T_COLLISION_DETAILS.clear();
        var dist = Math.sqrt(distanceSq);
        this._T_COLLISION_DETAILS.a = a;
        this._T_COLLISION_DETAILS.b = b;
        this._T_COLLISION_DETAILS.overlap = totalRadius - dist;
        this._T_COLLISION_DETAILS.overlapN.copy(differenceV.normalize());
        this._T_COLLISION_DETAILS.overlapV.copy(differenceV).scale(this._T_COLLISION_DETAILS.overlap);
        this._T_COLLISION_DETAILS.aInB = a.radius <= b.radius && dist <= b.radius - a.radius;
        this._T_COLLISION_DETAILS.bInA = b.radius <= a.radius && dist <= a.radius - b.radius;
        return this._T_COLLISION_DETAILS;
      }
      this._T_VECTORS.push(differenceV);
      return true;
    }
  }, {
    key: "testPolygonPolygon",
    value: function testPolygonPolygon(a, b) {
      var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this._T_COLLISION_DETAILS.clear();
      var aPoints = a.calcPoints;
      var aLen = aPoints.length;
      var bPoints = b.calcPoints;
      var bLen = bPoints.length;
      for (var i = 0;i < aLen; i++) {
        if (this._isSeparatingAxis(a.position, b.position, aPoints, bPoints, a.normals[i], this._T_COLLISION_DETAILS)) {
          return false;
        }
      }
      for (var _i2 = 0;_i2 < bLen; _i2++) {
        if (this._isSeparatingAxis(a.position, b.position, aPoints, bPoints, b.normals[_i2], this._T_COLLISION_DETAILS)) {
          return false;
        }
      }
      if (details) {
        this._T_COLLISION_DETAILS.a = a;
        this._T_COLLISION_DETAILS.b = b;
        this._T_COLLISION_DETAILS.overlapV.copy(this._T_COLLISION_DETAILS.overlapN).scale(this._T_COLLISION_DETAILS.overlap);
        return this._T_COLLISION_DETAILS;
      }
      return true;
    }
  }, {
    key: "testPolygonCircle",
    value: function testPolygonCircle(polygon, circle) {
      var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      this._T_COLLISION_DETAILS.clear();
      var circlePos = this._T_VECTORS.pop().copy(circle.position).add(circle.offset).sub(polygon.position);
      var radius = circle.radius;
      var radius2 = radius * radius;
      var points = polygon.calcPoints;
      var len = points.length;
      var edge = this._T_VECTORS.pop();
      var point = this._T_VECTORS.pop();
      for (var i = 0;i < len; i++) {
        var next = i === len - 1 ? 0 : i + 1;
        var prev = i === 0 ? len - 1 : i - 1;
        var overlap = 0;
        var overlapN = null;
        edge.copy(polygon.edges[i]);
        point.copy(circlePos).sub(points[i]);
        if (details && point.len2() > radius2)
          this._T_COLLISION_DETAILS.aInB = false;
        var region = this._voronoiRegion(edge, point);
        if (region === this._LEFT_VORONOI_REGION) {
          edge.copy(polygon.edges[prev]);
          var point2 = this._T_VECTORS.pop().copy(circlePos).sub(points[prev]);
          region = this._voronoiRegion(edge, point2);
          if (region === this._RIGHT_VORONOI_REGION) {
            var dist = point.len();
            if (dist > radius) {
              this._T_VECTORS.push(circlePos);
              this._T_VECTORS.push(edge);
              this._T_VECTORS.push(point);
              this._T_VECTORS.push(point2);
              return false;
            } else if (details) {
              this._T_COLLISION_DETAILS.bInA = false;
              overlapN = point.normalize();
              overlap = radius - dist;
            }
          }
          this._T_VECTORS.push(point2);
        } else if (region === this._RIGHT_VORONOI_REGION) {
          edge.copy(polygon.edges[next]);
          point.copy(circlePos).sub(points[next]);
          region = this._voronoiRegion(edge, point);
          if (region === this._LEFT_VORONOI_REGION) {
            var _dist = point.len();
            if (_dist > radius) {
              this._T_VECTORS.push(circlePos);
              this._T_VECTORS.push(edge);
              this._T_VECTORS.push(point);
              return false;
            } else if (details) {
              this._T_COLLISION_DETAILS.bInA = false;
              overlapN = point.normalize();
              overlap = radius - _dist;
            }
          }
        } else {
          var normal = edge.perp().normalize();
          var _dist2 = point.dot(normal);
          var distAbs = Math.abs(_dist2);
          if (_dist2 > 0 && distAbs > radius) {
            this._T_VECTORS.push(circlePos);
            this._T_VECTORS.push(normal);
            this._T_VECTORS.push(point);
            return false;
          } else if (details) {
            overlapN = normal;
            overlap = radius - _dist2;
            if (_dist2 >= 0 || overlap < 2 * radius)
              this._T_COLLISION_DETAILS.bInA = false;
          }
        }
        if (overlapN && details && Math.abs(overlap) < Math.abs(this._T_COLLISION_DETAILS.overlap)) {
          this._T_COLLISION_DETAILS.overlap = overlap;
          this._T_COLLISION_DETAILS.overlapN.copy(overlapN);
        }
      }
      if (details) {
        this._T_COLLISION_DETAILS.a = polygon;
        this._T_COLLISION_DETAILS.b = circle;
        this._T_COLLISION_DETAILS.overlapV.copy(this._T_COLLISION_DETAILS.overlapN).scale(this._T_COLLISION_DETAILS.overlap);
      }
      this._T_VECTORS.push(circlePos);
      this._T_VECTORS.push(edge);
      this._T_VECTORS.push(point);
      if (details)
        return this._T_COLLISION_DETAILS;
      return true;
    }
  }, {
    key: "testCirclePolygon",
    value: function testCirclePolygon(circle, polygon) {
      var details = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
      var result = this.testPolygonCircle(polygon, circle, details);
      if (result && details) {
        var collisionDetails = result;
        var a = collisionDetails.a;
        var aInB = collisionDetails.aInB;
        collisionDetails.overlapN.reverse();
        collisionDetails.overlapV.reverse();
        collisionDetails.a = collisionDetails.b;
        collisionDetails.b = a;
        collisionDetails.aInB = collisionDetails.bInA;
        collisionDetails.bInA = aInB;
      }
      return result;
    }
  }, {
    key: "_isSeparatingAxis",
    value: function _isSeparatingAxis(aPos, bPos, aPoints, bPoints, axis, collisionDetails) {
      var rangeA = this._T_ARRAYS.pop();
      var rangeB = this._T_ARRAYS.pop();
      var offsetV = this._T_VECTORS.pop().copy(bPos).sub(aPos);
      var projectedOffset = offsetV.dot(axis);
      this._flattenPointsOn(aPoints, axis, rangeA);
      this._flattenPointsOn(bPoints, axis, rangeB);
      rangeB[0] += projectedOffset;
      rangeB[1] += projectedOffset;
      if (rangeA[0] > rangeB[1] || rangeB[0] > rangeA[1]) {
        this._T_VECTORS.push(offsetV);
        this._T_ARRAYS.push(rangeA);
        this._T_ARRAYS.push(rangeB);
        return true;
      }
      if (collisionDetails) {
        var overlap = 0;
        if (rangeA[0] < rangeB[0]) {
          collisionDetails.aInB = false;
          if (rangeA[1] < rangeB[1]) {
            overlap = rangeA[1] - rangeB[0];
            collisionDetails.bInA = false;
          } else {
            var option1 = rangeA[1] - rangeB[0];
            var option2 = rangeB[1] - rangeA[0];
            overlap = option1 < option2 ? option1 : -option2;
          }
        } else {
          collisionDetails.bInA = false;
          if (rangeA[1] > rangeB[1]) {
            overlap = rangeA[0] - rangeB[1];
            collisionDetails.aInB = false;
          } else {
            var _option = rangeA[1] - rangeB[0];
            var _option2 = rangeB[1] - rangeA[0];
            overlap = _option < _option2 ? _option : -_option2;
          }
        }
        var absOverlap = Math.abs(overlap);
        if (absOverlap < collisionDetails.overlap) {
          collisionDetails.overlap = absOverlap;
          collisionDetails.overlapN.copy(axis);
          if (overlap < 0)
            collisionDetails.overlapN.reverse();
        }
      }
      this._T_VECTORS.push(offsetV);
      this._T_ARRAYS.push(rangeA);
      this._T_ARRAYS.push(rangeB);
      return false;
    }
  }, {
    key: "_flattenPointsOn",
    value: function _flattenPointsOn(points, normal, result) {
      var min = Number.MAX_VALUE;
      var max = -Number.MAX_VALUE;
      var len = points.length;
      for (var i = 0;i < len; i++) {
        var dot = points[i].dot(normal);
        if (dot < min)
          min = dot;
        if (dot > max)
          max = dot;
      }
      result[0] = min;
      result[1] = max;
    }
  }, {
    key: "_voronoiRegion",
    value: function _voronoiRegion(line, point) {
      var len2 = line.len2();
      var dp = point.dot(line);
      if (dp < 0)
        return this._LEFT_VORONOI_REGION;
      else if (dp > len2)
        return this._RIGHT_VORONOI_REGION;
      else
        return this._MIDDLE_VORONOI_REGION;
    }
  }]);
  return Collider2D2;
}();

// src/index.ts
var collider2d = new Collider2D;
var vec2 = (x, y) => new Vector(x, y);
var hitBounds = (ball) => {
  const circle = ball.object;
  const minima = circle.position.clone().sub(vec2(circle.radius, circle.radius)).len();
  if (minima < 0.205) {
    console.log("invert 1");
    return ["invert", undefined];
  }
  const maxima = circle.position.clone().add(vec2(circle.radius, circle.radius));
  const dx = maxima.sub(bounds.max).len();
  if (dx < 0.205) {
    console.log("invert 2");
    return ["invert", undefined];
  }
  const edges = [bounds.left, bounds.right, bounds.bottom, bounds.top];
  const { left, bottom, top, right } = bounds;
  for (const edge of edges) {
    const collision = collider2d.testCirclePolygon(circle, edge, true);
    if (collision.overlap < 1) {
      if (bounds.left === edge || bounds.right === edge) {
        return [true, vec2(0, 1)];
      }
      return [true, vec2(1, 0)];
    }
  }
  return [false, undefined];
};
var hitTile = (ball, tile) => {
  const collision = collider2d.testCirclePolygon(ball, tile.object, true);
  if (!collision) {
    return [false, undefined];
  }
  const { overlapV } = collision;
  if (Math.abs(overlapV.x) > Math.abs(overlapV.y)) {
    return [true, vec2(0, 1)];
  }
  return [true, vec2(1, 0)];
};
var inExec = op.inTrigger("Tick");
var inSpeed = op.inFloat("Speed");
var inRows = op.inFloat("Rows");
var inColumns = op.inFloat("Columns");
var inReset = op.inTriggerButton("Reset");
var inBounds = op.inBool("Enable Bounds");
var balls = [];
var tiles = [];
var bounds = {
  left: new Polygon,
  right: new Polygon,
  top: new Polygon,
  bottom: new Polygon,
  span: new Polygon,
  min: vec2(0, 0),
  max: vec2(10, 10),
  style: "dark"
};
var outBoard = op.outArray("Board", tiles);
var outBalls = op.outArray("Balls", balls);
var boundsStyle = op.outString("Bounds Style", "dark");
outBoard.setRef(tiles);
outBalls.setRef(balls);
var setup = () => {
  const rawRows = inRows.get() || 0;
  const rawColumns = inColumns.get() || 0;
  const inValidRange = rawRows > 0 && rawColumns > 0;
  op.setUiError("row-column-error", inValidRange ? null : "Either Rows or Columns is unset");
  if (!inValidRange) {
    return;
  }
  const startTime = Date.now();
  const rows = Math.floor(rawRows);
  const columns = Math.floor(rawColumns);
  bounds.bottom = new Polygon(vec2(0, 0), [
    vec2(-columns, -rows),
    vec2(columns * 2, -rows),
    vec2(columns * 2, 0),
    vec2(-columns, 0)
  ]);
  bounds.top = new Polygon(vec2(0, 0), [
    vec2(-columns, rows),
    vec2(columns * 2, rows),
    vec2(columns * 2, rows * 2),
    vec2(-columns, rows * 2)
  ]);
  bounds.left = new Polygon(vec2(0, 0), [
    vec2(-columns, -rows),
    vec2(0, -rows),
    vec2(0, rows * 2),
    vec2(-columns, rows * 2)
  ]);
  bounds.right = new Polygon(vec2(0, 0), [
    vec2(columns, -rows),
    vec2(columns * 2, -rows),
    vec2(columns * 2, rows * 2),
    vec2(columns, rows * 2)
  ]);
  bounds.span = new Box(vec2(columns / 2, rows / 2), columns / 2, rows / 2).toPolygon();
  bounds.max = vec2(columns + 0.5, rows + 0.5);
  const newLength = rows * columns;
  tiles.length = 0;
  for (let i = 0;i < rows * columns; i += 1) {
    const x = i % rows;
    const y = (i - x) / columns;
    tiles.push({
      style: "light",
      type: "tile",
      flipTime: 0,
      object: new Box(vec2(x, y), 1, 1).toPolygon()
    });
  }
  balls.length = 0;
  balls.push({
    type: "ball",
    style: "light",
    object: new Circle(vec2(1, 1), 0.5),
    direction: vec2(1, 1)
  }, {
    type: "ball",
    style: "light",
    object: new Circle(vec2(rows - 1.5, columns - 1.5), 0.5),
    direction: vec2(1, -1)
  });
};
inRows.onValueChanged = inColumns.onValueChanged = setup;
var timer = (() => {
  let lastTick = performance.now();
  let deltaTime = 0;
  const tick = () => {
    const currentTick = performance.now();
    deltaTime = Math.min((currentTick - lastTick) / 1000, 0.05);
    lastTick = currentTick;
    return {
      currentTick,
      deltaTime,
      tick
    };
  };
  return {
    lastTick,
    deltaTime,
    tick
  };
})();
inReset.onTriggered = setup;
inExec.onTriggered = () => {
  const speed = inSpeed.get() || 0;
  const enableBounds = inBounds.get() ?? true;
  op.setUiError("speed-error", speed === 0 ? "Speed unset, cannot tick" : null);
  if (speed === 0) {
    return;
  }
  const { deltaTime, currentTick } = timer.tick();
  if (Math.random() < 0.015) {
    const tile = tiles[Math.floor(Math.random() * tiles.length)];
    tile.style = "dark";
  }
  a:
    for (let i = 0;i < balls.length; i += 1) {
      const ball = balls[i];
      const delta = ball.direction.clone().normalize().scale(speed * deltaTime);
      const imposter = new Circle(ball.object.position.clone().add(delta), ball.object.radius);
      if (enableBounds) {
        const [intersects, axis] = hitBounds({
          direction: ball.direction,
          style: ball.style,
          type: "ball",
          object: imposter
        });
        if (intersects) {
          if (intersects === "invert") {
            ball.direction.scale(-1, -1);
          } else {
            ball.direction.reflect(axis);
          }
          ball.object.translate(ball.direction.x * speed * deltaTime, ball.direction.y * speed * deltaTime);
          if (bounds.style !== ball.style) {
            bounds.style = bounds.style === "dark" ? "light" : "dark";
            boundsStyle.set(bounds.style);
          }
          continue;
        }
      }
      for (const tile of tiles) {
        if (tile.style === ball.style) {
          continue;
        }
        const [doesIntersect, axis] = hitTile(imposter, tile);
        if (doesIntersect) {
          tile.style = tile.style === "dark" ? "light" : "dark";
          tile.flipTime = currentTick;
          if (ball.bounces === undefined && Math.random() < 0.35) {
            balls.push({
              direction: ball.direction.clone(),
              style: ball.style,
              type: "ball",
              object: new Circle(ball.object.position.clone(), ball.object.radius),
              bounces: Math.floor(Math.random() * 4 + 3)
            });
          }
          if (ball.bounces !== undefined) {
            if (ball.bounces <= 0) {
              balls.splice(i, 1);
              continue a;
            }
            ball.bounces -= 1;
          }
          ball.direction.reflect(axis);
          const direction = ball.direction.clone().normalize();
          ball.object.translate(direction.x * speed * deltaTime, direction.y * speed * deltaTime);
          continue a;
        }
      }
      ball.object.translate(delta.x, delta.y);
    }
  outBalls.set(balls);
};
