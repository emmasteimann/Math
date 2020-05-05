import Constructors from "../constructors";
import { distance2 } from "../../core/algebra";
import { nearest_point_on_ellipse } from "../../core/nearest";
import {
  resize,
  flatten_arrays,
  get_vector,
  get_vector_of_vectors,
} from "../../parsers/arguments";
import Intersect from "../../intersection/index";

import { pathInfo } from "./path";

const f = (n) => (Number.isInteger(n) ? n : n.toFixed(4));

// (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+
const ellipticalArcTo = (rx, ry, phi_degrees, fa, fs, endX, endY) =>
  `A${f(rx)} ${f(ry)} ${f(phi_degrees)} ${f(fa)} ${f(fs)} ${f(endX)} ${f(endY)}`;

const getFoci = function (center, rx, ry, spin) {
  const order = rx > ry;
  const lsq = order ? (rx ** 2) - (ry ** 2) : (ry ** 2) - (rx ** 2);
  const l = Math.sqrt(lsq);
  const trigX = order ? Math.cos(spin) : Math.sin(spin);
  const trigY = order ? Math.sin(spin) : Math.cos(spin);
  return [
    Constructors.vector(center[0] + l * trigX, center[1] + l * trigY),
    Constructors.vector(center[0] - l * trigX, center[1] - l * trigY),
  ];
};

export default {
  ellipse: {
    A: function () {
      // const arr = Array.from(arguments);
      const numbers = flatten_arrays(arguments).filter(a => !isNaN(a));
      const params = resize(5, numbers);
      this.rx = params[0];
      this.ry = params[1];
      this.origin = Constructors.vector(params[2], params[3]);
      this.spin = params[4];
      this.foci = getFoci(this.origin, this.rx, this.ry, this.spin);
      // const numbers = arr.filter(param => !isNaN(param));
      // const vectors = get_vector_of_vectors(arr);
      // if (numbers.length === 4) {
      //   // this.origin = Constructors.vector(numbers[0], numbers[1]);
      //   // this.rx = numbers[2];
      //   // this.ry = numbers[3];
      // } else if (vectors.length === 2) {
      //   // two foci
      //   // this.radius = distance2(...vectors);
      //   // this.origin = Constructors.vector(...vectors[0]);
      // }
    },

    G: {
      x: function () { return this.origin[0]; },
      y: function () { return this.origin[1]; },
    },
    M: {
      nearestPoint: function () {
        return Constructors.vector(nearest_point_on_ellipse(
          this.origin,
          this.radius,
          get_vector(arguments)
        ));
      },
      intersect: function (object) {
        return Intersect(this, object);
      },
      path: function (arcStart = 0, deltaArc = Math.PI * 2) {
        const info = pathInfo(this.origin[0], this.origin[1], this.rx, this.ry, this.spin, arcStart, deltaArc);
        const arc1 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x2, info.y2);
        const arc2 = ellipticalArcTo(this.rx, this.ry, (this.spin / Math.PI) * 180, info.fa, info.fs, info.x3, info.y3);
        return `M${f(info.x1)} ${f(info.y1)}${arc1}${arc2}`;
      },
    },

    S: {
      // static methods
      // fromPoints: function () {
      //   const points = get_vector_of_vectors(arguments);
      //   return Constructors.circle(points, distance2(points[0], points[1]));
      // }
    }
  }
};
