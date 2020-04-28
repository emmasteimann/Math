import { get_vector_of_vectors } from "../parsers/arguments";

import {
  make_regular_polygon,
  convex_hull,
} from "../core/geometry";

import Vector from "./vector/index";
import Segment from "./segment";

import Prototype from "./prototypes/polygon";

const Polygon = function (...args) {
  const points = get_vector_of_vectors(args).map(p => Vector(p));
  // todo, best practices here
  if (points === undefined) { return undefined; }
  const sides = points
    .map((p, i, arr) => [p, arr[(i + 1) % arr.length]])
    .map(ps => Segment(ps[0][0], ps[0][1], ps[1][0], ps[1][1]));

  const proto = Prototype.bind(this);
  const polygon = Object.create(proto());
  Object.defineProperty(polygon, "points", { get: () => points });
  Object.defineProperty(polygon, "sides", { get: () => sides });
  return polygon;
};

Polygon.regularPolygon = function (sides, x = 0, y = 0, radius = 1) {
  const points = make_regular_polygon(sides, x, y, radius);
  return Polygon(points);
};
Polygon.convexHull = function (points, includeCollinear = false) {
  const hull = convex_hull(points, includeCollinear);
  return Polygon(hull);
};

export default Polygon;