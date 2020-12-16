const math = require("../math");

const testArrays = (a, b) => {
	a.forEach((_, i) => {
		if (typeof a[i] === "number") { expect(a[i]).toBeCloseTo(b[i]); }
		else if (typeof a[i] === "object" && a[i].constructor === Array) {
			expect(math.core.equivalent_vectors(a[i], b[i])).toBe(true);
		}
		else { expect(a[i]).toBe(b[i]); }
	});
	expect(a.length).toBe(b.length);
};

test("alternating sum", () => {
	testArrays([0, 0], math.core.alternating_sum([]));
	testArrays([1, 0], math.core.alternating_sum([1]));
	testArrays([16, 20], math.core.alternating_sum([1, 2, 3, 4, 5, 6, 7, 8]));
});

test("alternating deviation, equal pairs", () => {
	const equal2 = [Math.PI, Math.PI];
	const equal4 = Array(4).fill(Math.PI / 2);
	testArrays([0, 0], math.core.alternating_deviation(equal2));
	testArrays([0, 0], math.core.alternating_deviation(equal4));
	testArrays([0, 0],
	  math.core.alternating_deviation(
		  math.core.interior_angles([1, 0], [0, 1], [-1, 0], [0, -1])));
});

test("alternating deviation, non-equal pairs", () => {
	// two Math.PI +/- 1
	const arr2 = Array(2).fill(Math.PI).map((v, i) => v + (i % 2 ? 1 : -1));
  // four Math.PI/2 +/- 1/2
	const arr4 = Array(4).fill(Math.PI / 2).map((v, i) => v + (i % 2 ? 1/2 : -1/2));
	testArrays([-1, 1], math.core.alternating_deviation(arr2));
	testArrays([-1, 1], math.core.alternating_deviation(arr4));
});

test("kawasaki solutions radians", () => {
	testArrays(
	  [undefined, undefined, 1.25 * Math.PI],
	  math.core.kawasaki_solutions_radians([
	    0, Math.PI / 2, Math.PI / 4 * 3
	  ])
	);
});

test("kawasaki solutions", () => {
	testArrays([
	    [Math.cos(Math.PI * 1 / 3), Math.sin(Math.PI * 1 / 3)],
	    [Math.cos(Math.PI * 3 / 3), Math.sin(Math.PI * 3 / 3)],
	    [Math.cos(Math.PI * 5 / 3), Math.sin(Math.PI * 5 / 3)]
		],
	  math.core.kawasaki_solutions([
	    [Math.cos(0), Math.sin(0)],
	    [Math.cos(Math.PI * 2 / 3), Math.sin(Math.PI * 2 / 3)],
	    [Math.cos(Math.PI * 4 / 3), Math.sin(Math.PI * 4 / 3)]
	  ])
	);

	const sqrt05 = Math.sqrt(1/2);
	testArrays([undefined, undefined, [-sqrt05, -sqrt05]],
	  math.core.kawasaki_solutions([
	    [Math.cos(0), Math.sin(0)],
	    [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4)],
	    [Math.cos(Math.PI / 2), Math.sin(Math.PI / 2)]
	  ]));
});

