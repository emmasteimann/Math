const math = require("../math");

/**
 * queries
 */
test("equivalent", () => {
  expect(math.core.equivalent(4, 4, 4)).toBe(true);
  expect(math.core.equivalent(4, 4, 5)).toBe(false);
  expect(math.core.equivalent([0], [0], [0])).toBe(true);
  // equivalent is permissive with trailing zeros
  expect(math.core.equivalent([0], [0, 0], [0])).toBe(true);
  expect(math.core.equivalent([1], [1, 0], [1])).toBe(true);
  // should be false
  expect(math.core.equivalent([0], [0, 1], [0])).toBe(false);
  expect(math.core.equivalent([0], [0], [1])).toBe(false);
  expect(math.core.equivalent([1], [0], [1])).toBe(false);
  // epsilon
  expect(math.core.equivalent(1, 1, 0.99999999999)).toBe(true);
  expect(math.core.equivalent([1], [1], [0.99999999999])).toBe(true);
  expect(math.core.equivalent([1], [1, 1], [1])).toBe(false);
  expect(math.core.equivalent(true, true, true, true)).toBe(true);
  expect(math.core.equivalent(false, false, false, false)).toBe(true);
  expect(math.core.equivalent(false, false, false, true)).toBe(false);
});

// // equivalency has not yet been made to work with other types.
// // inside the equivalent function, it calls equivalent_vectors which calls
// // get_vector_of_vectors, which is forcing the removal of data that isn't a number
// test("equivalent with strings", () => {
//   expect(math.core.equivalent("hi", "hi", "hi")).toBe(true);
//   expect(math.core.equivalent("hi", "hi", "bye")).toBe(false);
//   expect(math.core.equivalent(["hi", "hi"], ["hi", "hi", "hi"])).toBe(false);
// });

test("equivalent with functions", () => {
  expect(math.core.equivalent(() => {}, () => {})).toBe(undefined);
});

test("equivalent with objects", () => {
  expect(math.core.equivalent({hi: 5}, {hi: 5})).toBe(true);
  expect(math.core.equivalent({hi: 5}, {hello: 5})).toBe(false);
});

test("equivalent numbers", () => {
  expect(math.core.equivalent_numbers()).toBe(false);
  expect(math.core.equivalent_numbers([[[1, 1, 1, 1, 1]]])).toBe(true);
  expect(math.core.equivalent_numbers([[[1, 1, 1, 1, 1, 4]]])).toBe(false);
  expect(math.core.equivalent_numbers([1, 1, 1, 1, 1, 1], [1, 2])).toBe(false);
});

test("equivalent vectors", () => {
	const smEp = math.core.EPSILON / 10; // smaller than epsilon
	const bgEp = math.core.EPSILON * 10; // larger than epsilon
	expect(math.core.equivalent_vectors([1, 2, 3], [1, 2, 3])).toBe(true);
	expect(math.core.equivalent_vectors([1, 2 + smEp], [1, 2 - smEp])).toBe(true);
	expect(math.core.equivalent_vectors([1, 2 + bgEp], [1, 2 - bgEp])).toBe(false);
});


