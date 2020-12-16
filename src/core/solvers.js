import { EPSILON } from "./constants";

const cuberoot = function (x) {
  const y = Math.pow(Math.abs(x), 1 / 3);
  return x < 0 ? -y : y;
};

export const solveCubic = function (a, b, c, d) {
  if (Math.abs(a) < EPSILON) { // Quadratic case, ax^2+bx+c=0
    a = b; b = c; c = d;
    if (Math.abs(a) < EPSILON) { // Linear case, ax+b=0
      a = b; b = c;
      if (Math.abs(a) < EPSILON) { // Degenerate case
        return [];
      }
      return [-b / a];
    }
    const D = b * b - 4 * a * c;
    if (Math.abs(D) < EPSILON) {
      return [-b / (2 * a)];
    }
    if (D > 0) {
      return [(-b + Math.sqrt(D)) / (2 * a), (-b - Math.sqrt(D)) / (2 * a)];
    }
    return [];
  }
  // Convert to depressed cubic t^3+pt+q = 0 (subst x = t - b/3a)
  const p = (3 * a * c - b * b) / (3 * a * a);
  const q = (2 * b * b * b - 9 * a * b * c + 27 * a * a * d) / (27 * a * a * a);
  let roots;

  if (Math.abs(p) < EPSILON) { // p = 0 -> t^3 = -q -> t = -q^1/3
    roots = [cuberoot(-q)];
  } else if (Math.abs(q) < EPSILON) { // q = 0 -> t^3 + pt = 0 -> t(t^2+p)=0
    roots = [0].concat(p < 0 ? [Math.sqrt(-p), -Math.sqrt(-p)] : []);
  } else {
    const D = q * q / 4 + p * p * p / 27;
    if (Math.abs(D) < EPSILON) { // D = 0 -> two roots
      roots = [-1.5 * q / p, 3 * q / p];
    } else if (D > 0) { // Only one real root
      const u = cuberoot(-q / 2 - Math.sqrt(D));
      roots = [u - p / (3 * u)];
    } else {
      // D < 0, three roots, needs complex numbers/trigonometric solution
      const u = 2 * Math.sqrt(-p / 3);
      // D < 0 implies p < 0 and acos argument in [-1..1]
      const t = Math.acos(3 * q / p / u) / 3;
      const k = 2 * Math.PI / 3;
      roots = [u * Math.cos(t), u * Math.cos(t - k), u * Math.cos(t - 2 * k)];
    }
  }
  // Convert back from depressed cubic
  for (let i = 0; i < roots.length; i += 1) {
    roots[i] -= b / (3 * a);
  }
  return roots;
};
