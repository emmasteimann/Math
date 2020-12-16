// infinity box
const infinityBox = math.rect(-1000, -1000, 2000, 2000);

const states = {
  select: {
    svg: pts => SVG.rect(
      pts[0].x,
      pts[0].y,
      pts[pts.length - 1].x - pts[0].x,
      pts[pts.length - 1].y - pts[0].y
    ).strokeWidth(0.004).strokeDasharray(0.01),
    math: math.rect.fromPoints,
  },
  remove: {
    svg: SVG.g,
    math: pts => {},
  },
  line: {
    svg: (...pts) => {
      const p = infinityBox.clipLine(math.line.fromPoints(...pts));
      return p === undefined
        ? undefined
        : SVG.line(p.points);
    },
    math: math.line.fromPoints,
  },
  ray: {
    svg: (...pts) => {
      const p = infinityBox.clipRay(math.ray.fromPoints(...pts));
      return p === undefined
        ? undefined
        : SVG.line(p.points);
    },
    math: math.ray.fromPoints,
  },
  segment: {
    svg: SVG.line,
    math: math.segment,
  },
  circle: {
    svg: (...pts) => SVG.circle(...pts).stroke("#158").strokeWidth(0.004),
    math: math.circle,
  },
  "perpendicular-bisector": {
    svg: (...pts) => {
      const p = infinityBox.clipLine(math.line.perpendicularBisector(...pts));
      return SVG.line(p.points);
    },
    math: math.line.perpendicularBisector,
  },
  bisect: {
    svg: SVG.polyline,
    math: pts => {},
  },
  "perpendicular-to": {
    svg: SVG.g,
    math: pts => {},
  },
  polygon: {
    svg: SVG.g,
    math: math.polygon,
  },
  // this will create an entry in the Cache that a previous
  // shape has been mutated.
  // alter: {
  //   svg: SVG.g,
  //   math: pts => {},
  // }
};

// export default states;
