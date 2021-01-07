const math = require("../math");

const testEqualVectors = function (...args) {
  expect(math.core.equivalent_vectors(...args)).toBe(true);
};

test("is_counter_clockwise_between", () => {
  expect(math.core.is_counter_clockwise_between(0.5, 0, 1)).toBe(true);
  expect(math.core.is_counter_clockwise_between(0.5, 1, 0)).toBe(false);
  expect(math.core.is_counter_clockwise_between(11, 10, 12)).toBe(true);
  expect(math.core.is_counter_clockwise_between(11, 12, 10)).toBe(false);
  expect(math.core.is_counter_clockwise_between(Math.PI*2*4 + Math.PI/2, 0, Math.PI)).toBe(true);
  expect(math.core.is_counter_clockwise_between(Math.PI*2*4 + Math.PI/2, Math.PI, 0)).toBe(false);
});

test("interior angles", () => {
  testEqualVectors(
    [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
    [[1, 0], [0, 1], [-1, 0], [0, -1]].map((v, i, ar) => math.core
      .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
  );
  testEqualVectors(
    [Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
    [[1, 1], [-1, 1], [-1, -1], [1, -1]].map((v, i, ar) => math.core
      .counter_clockwise_angle2(v, ar[(i + 1) % ar.length]))
  );
});

test("counter-clockwise vector sorting", () => {
  testEqualVectors(
    [0, 1, 2, 3],
    math.core.counter_clockwise_order2([1, 1], [-1, 1], [-1, -1], [1, -1])
  );
  testEqualVectors(
    [0, 3, 2, 1],
    math.core.counter_clockwise_order2([1, -1], [-1, -1], [-1, 1], [1, 1])
  );
});

// test("sectors", () => {
//   testEqual(Math.PI / 2, math.sector.fromVectors([1, 0], [0, 1]).angle);
//   testEqual(true, math.sector.fromVectors([1, 0], [0, 1]).contains([1, 1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, 1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([-1, -1]));
//   testEqual(false, math.sector.fromVectors([1, 0], [0, 1]).contains([1, -1]));
// });

// test("junctions", () => {
//   testEqual([[1, 1], [1, -1], [-1, 1], [-1, -1]],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectors);
//   testEqual([0, 2, 3, 1],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).vectorOrder);
//   testEqual([Math.PI / 2, Math.PI / 2, Math.PI / 2, Math.PI / 2],
//     math.junction([1, 1], [1, -1], [-1, 1], [-1, -1]).angles());
// });

test("clockwise_angle_radians", () => {
  expect(math.core.clockwise_angle_radians(Math.PI, Math.PI/2))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.clockwise_angle_radians(Math.PI/2, Math.PI))
    .toBeCloseTo(Math.PI*3/2);
  // same as above with negative numbers
  expect(math.core.clockwise_angle_radians(Math.PI + Math.PI*2*4, Math.PI/2 - Math.PI*2*8))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.clockwise_angle_radians(Math.PI/2 - Math.PI*2*3, Math.PI + Math.PI*2*4))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.clockwise_angle_radians(Math.PI - Math.PI*2*4, Math.PI/2 - Math.PI*2*8))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.clockwise_angle_radians(Math.PI/2 - Math.PI*2*3, Math.PI - Math.PI*2*4))
    .toBeCloseTo(Math.PI*3/2);
});

test("counter_clockwise_angle_radians", () => {
  expect(math.core.counter_clockwise_angle_radians(Math.PI, Math.PI/2))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.counter_clockwise_angle_radians(Math.PI/2, Math.PI))
    .toBeCloseTo(Math.PI*1/2);
  // same as above with negative numbers
  expect(math.core.counter_clockwise_angle_radians(Math.PI - Math.PI*2*4, Math.PI/2 - Math.PI*2*5))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.counter_clockwise_angle_radians(Math.PI + Math.PI*2*4, Math.PI/2 + Math.PI*2*5))
    .toBeCloseTo(Math.PI*3/2);
  expect(math.core.counter_clockwise_angle_radians(Math.PI/2 - Math.PI*2*7, Math.PI - Math.PI*2*3))
    .toBeCloseTo(Math.PI*1/2);
});

test("clockwise_angle2", () => {
  expect(math.core.clockwise_angle2([1,0], [0,1])).toBeCloseTo(Math.PI*3/2);
  expect(math.core.clockwise_angle2([0,1], [1,0])).toBeCloseTo(Math.PI*1/2);
});

test("counter_clockwise_angle2", () => {
  expect(math.core.counter_clockwise_angle2([1,0], [0,1]))
    .toBeCloseTo(Math.PI*1/2);
  expect(math.core.counter_clockwise_angle2([0,1], [1,0]))
    .toBeCloseTo(Math.PI*3/2);
});

// test("counter_clockwise_vector_order", () => {
//   math.core.counter_clockwise_vector_order(...vectors)
// });

test("interior sector angles", () => {
  expect(math.core.counter_clockwise_sectors2([1,0], [0,1], [-1,0])[0]).toBeCloseTo(Math.PI/2);
  expect(math.core.counter_clockwise_sectors2([1,0], [0,1], [-1,0])[1]).toBeCloseTo(Math.PI/2);
  expect(math.core.counter_clockwise_sectors2([1,0], [0,1], [-1,0])[2]).toBeCloseTo(Math.PI);

  expect(math.core.counter_clockwise_sectors2([1,0], [-1,0], [0,-1])[0]).toBeCloseTo(Math.PI);
  expect(math.core.counter_clockwise_sectors2([1,0], [-1,0], [0,-1])[1]).toBeCloseTo(Math.PI/2);
  expect(math.core.counter_clockwise_sectors2([1,0], [-1,0], [0,-1])[2]).toBeCloseTo(Math.PI/2);
});

test("clockwise bisect", () => {
  expect(math.core.clockwise_bisect2([1,0], [0,-1])[0]).toBeCloseTo(Math.sqrt(2)/2);
  expect(math.core.clockwise_bisect2([1,0], [0,-1])[1]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(math.core.clockwise_bisect2([1,0], [-1,0])[0]).toBeCloseTo(0);
  expect(math.core.clockwise_bisect2([1,0], [-1,0])[1]).toBeCloseTo(-1);
  expect(math.core.clockwise_bisect2([1,0], [0,1])[0]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(math.core.clockwise_bisect2([1,0], [0,1])[1]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(math.core.clockwise_bisect2([1,0], [1,0])[0]).toBeCloseTo(1);
  expect(math.core.clockwise_bisect2([1,0], [1,0])[1]).toBeCloseTo(0);
});

test("counter-clockwise bisect", () => {
  expect(math.core.counter_clockwise_bisect2([1,0], [0,1])[0]).toBeCloseTo(Math.sqrt(2)/2);
  expect(math.core.counter_clockwise_bisect2([1,0], [0,1])[1]).toBeCloseTo(Math.sqrt(2)/2);
  expect(math.core.counter_clockwise_bisect2([1,0], [-1,0])[0]).toBeCloseTo(0);
  expect(math.core.counter_clockwise_bisect2([1,0], [-1,0])[1]).toBeCloseTo(1);
  expect(math.core.counter_clockwise_bisect2([1,0], [0,-1])[0]).toBeCloseTo(-Math.sqrt(2)/2);
  expect(math.core.counter_clockwise_bisect2([1,0], [0,-1])[1]).toBeCloseTo(Math.sqrt(2)/2);
  expect(math.core.counter_clockwise_bisect2([1,0], [1,0])[0]).toBeCloseTo(1);
  expect(math.core.counter_clockwise_bisect2([1,0], [1,0])[1]).toBeCloseTo(0);
});

test("counter_clockwise_bisect2", () => {
  expect(math.core.counter_clockwise_bisect2([1,0], [0,1])[0])
    .toBeCloseTo(Math.sqrt(2)/2);
  expect(math.core.counter_clockwise_bisect2([1,0], [0,1])[1])
    .toBeCloseTo(Math.sqrt(2)/2);
  expect(math.core.counter_clockwise_bisect2([0,1], [-1,0])[0])
    .toBeCloseTo(-Math.sqrt(2)/2);
  expect(math.core.counter_clockwise_bisect2([0,1], [-1,0])[1])
    .toBeCloseTo(Math.sqrt(2)/2);
  // flipped vectors
  expect(math.core.counter_clockwise_bisect2([1,0], [-1,0])[0]).toBeCloseTo(0);
  expect(math.core.counter_clockwise_bisect2([1,0], [-1,0])[1]).toBeCloseTo(1);
});

test("bisect_lines2", () => {
  expect(math.core.bisect_lines2([0,1], [0,0], [0,1], [1,0])[1])
    .toBe(undefined);
  expect(math.core.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0].vector[0])
    .toBeCloseTo(0);
  expect(math.core.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0].vector[1])
    .toBeCloseTo(1);
  expect(math.core.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0].origin[0])
    .toBeCloseTo(0.5);
  expect(math.core.bisect_lines2([0,1], [0,0], [0,1], [1,0])[0].origin[1])
    .toBeCloseTo(0);
  
  expect(math.core.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].vector[0])
    .toBeCloseTo(0.3826834323650897);
  expect(math.core.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].vector[1])
    .toBeCloseTo(0.9238795325112867);
  expect(math.core.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].origin[0])
    .toBeCloseTo(0);
  expect(math.core.bisect_lines2([0,1], [0,0], [1,1], [1,0])[0].origin[1])
    .toBeCloseTo(-1);

});

test("counter_clockwise_subsect_radians", () => {
	testEqualVectors(math.core.counter_clockwise_subsect_radians(3, 0, 3),
		[1, 2]);
	testEqualVectors(math.core.counter_clockwise_subsect_radians(3, -1, 2),
		[0, 1]);
	expect(math.core.counter_clockwise_subsect_radians(4, 0, -Math.PI)[0])
		.toBeCloseTo(Math.PI * 1 / 4);
	expect(math.core.counter_clockwise_subsect_radians(4, 0, -Math.PI)[1])
		.toBeCloseTo(Math.PI * 2 / 4);
	expect(math.core.counter_clockwise_subsect_radians(4, 0, -Math.PI)[2])
		.toBeCloseTo(Math.PI * 3 / 4);
	expect(math.core.counter_clockwise_subsect_radians(2, 0, -Math.PI)[0])
		.toBeCloseTo(Math.PI / 2);
	expect(math.core.counter_clockwise_subsect_radians(1, 0, -Math.PI).length)
		.toBe(0);
});
 
test("counter_clockwise_subsect2", () => {
	expect(math.core.counter_clockwise_subsect2(2, [1,0], [0,1])[0][0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.core.counter_clockwise_subsect2(2, [1,0], [0,1])[0][1])
		.toBeCloseTo(Math.sqrt(2) / 2);

	expect(math.core.counter_clockwise_subsect2(4, [1,0], [-1,0])[0][0])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.core.counter_clockwise_subsect2(4, [1,0], [-1,0])[0][1])
		.toBeCloseTo(Math.sqrt(2) / 2);
	expect(math.core.counter_clockwise_subsect2(4, [1,0], [-1,0])[1][0])
		.toBeCloseTo(0);
	expect(math.core.counter_clockwise_subsect2(4, [1,0], [-1,0])[1][1])
		.toBeCloseTo(1);
	expect(math.core.counter_clockwise_subsect2(4, [1,0], [-1,0])[2][0])
		.toBeCloseTo(-Math.sqrt(2) / 2);
	expect(math.core.counter_clockwise_subsect2(4, [1,0], [-1,0])[2][1])
		.toBeCloseTo(Math.sqrt(2) / 2);
});


