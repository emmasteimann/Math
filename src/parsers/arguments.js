/**
 * this is *filled* with heuristic methods, methods that make assumptions,
 * methods that take in user-input and infer a best match.
 */
/**
 * one way to improve these input finders is to search in all indices
 * of the arguments list, right now it assumes THIS is the only thing
 * you're passing in. in the case that it isn't and there's an object
 * in the first slot, it won't find the valid data in the second.
 */

const countPlaces = function (num) {
  const m = (`${num}`).match(/(?:\.(\d+))?(?:[eE]([+-]?\d+))?$/);
  if (!m) { return 0; }
  return Math.max(0, (m[1] ? m[1].length : 0) - (m[2] ? +m[2] : 0));
};
/**
 * clean floating point numbers
 * example: 15.0000000000000002 into 15
 * the epsilon is adjustable default 15 places for Javascript's 16 digit float.
 * the remainder will be chopped off, make this epsilon as small as possible.
 * @args must be a number! do you own checking. this is for speed.
 */
export const clean_number = function (num, places = 15) {
  if (typeof num !== "number") { return num; }
  const crop = parseFloat(num.toFixed(places));
  if (countPlaces(crop) === Math.min(places, countPlaces(num))) {
    return num;
  }
  return crop;
};

/**
 * type checking
 */
export const is_number = (n => n != null && !isNaN(n));
export const is_vector = (a => a != null && a[0] != null && !isNaN(a[0]));
export const is_iterable = obj => obj != null
  && typeof obj[Symbol.iterator] === "function";

/**
 * totally flatten, recursive
 * @returns an array, always.
 */
export const flatten_input = function (...args) {
  switch (args.length) {
    case undefined:
    case 0: return args;
    // only if its an array (is iterable) and NOT a string
    case 1: return is_iterable(args[0]) && typeof args[0] !== "string"
      ? flatten_input(...args[0])
      : [args[0]];
    default:
      return Array.from(args)
        .map(a => (is_iterable(a)
          ? [...flatten_input(a)]
          : a))
        .reduce((a, b) => a.concat(b), []);
  }
};

/**
 * flatten only until the point of comma separated entities. iterative
 * @returns always an array
 */
export const semi_flatten_input = function (...args) {
  let list = args;
  while (list.length === 1 && list[0].length) { [list] = list; }
  return list;
};

/**
 * search function arguments for a valid n-dimensional vector
 * can handle object-vector representation {x:, y:}
 *
 * @returns (number[]) vector in array form, or empty array for bad inputs
*/
export const get_vector = function (...args) {
  let list = flatten_input(args).filter(a => a !== undefined);
  if (list === undefined) { return undefined; }
  if (list.length === 0) { return undefined; }
  if (!isNaN(list[0].x)) {
    list = ["x", "y", "z"].map(c => list[0][c]).filter(a => a !== undefined);
  }
  return list.filter(n => typeof n === "number");
};

/**
 * search function arguments for a an array of vectors. a vector of vectors
 * can handle object-vector representation {x:, y:}
 *
 * @returns (number[]) vector in array form, or empty array for bad inputs
*/
export const get_vector_of_vectors = function (...args) {
  return semi_flatten_input(args)
    .map(el => get_vector(el));
};

const identity2 = [1, 0, 0, 1, 0, 0];
const identity3 = [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0];

/**
 * a matrix2 is a 2x3 matrix, 2x2 with a column to represent translation
 *
 * @returns {number[]} array of 6 numbers, or undefined if bad inputs
*/
export const get_matrix2 = function (...args) {
  const m = get_vector(args);
  if (m === undefined) { return undefined; }
  if (m.length === 6) { return m; }
  if (m.length > 6) { return [m[0], m[1], m[2], m[3], m[4], m[5]]; }
  if (m.length < 6) {
    return identity2.map((n, i) => m[i] || n);
  }
  // m doesn't have a length
  return undefined;
};
/**
 * a matrix3 is a 4x3 matrix, 3x3 orientation with a column for translation
 *
 * @returns {number[]} array of 12 numbers, or undefined if bad inputs
*/
export const get_matrix3 = function (...args) {
  const m = get_vector(args);
  if (m === undefined) { return undefined; }
  switch (m.length) {
    case 4: return [
      m[0], m[1], 0, 0,
      m[2], m[3], 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ];
    case 6: return [
      m[0], m[1], 0,
      m[2], m[3], 0,
      0, 0, 1,
      m[4], m[5], 0
    ];
    case 9: return [
      m[0], m[1], m[2],
      m[3], m[4], m[5],
      m[6], m[7], m[8],
      0, 0, 0
    ];
    case 12: return m;
    // convert a 4x4 (openGL type) matrix into 3x4
    case 16: return [
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10],
      m[12], m[13], m[14]
    ];
    default: break;
  }
  if (m.length > 12) {
    return [
      m[0], m[1], m[2],
      m[4], m[5], m[6],
      m[8], m[9], m[10],
      m[12], m[13], m[14]
    ];
  }
  if (m.length < 12) {
    return identity3.map((n, i) => m[i] || n);
  }
  // m doesn't have a length
  return undefined;
};

/**
 * @returns [[2,3],[10,11]]
*/
export function get_segment(...args) {
  return get_vector_of_vectors(args);
}

/**
 * @returns ({ point:[], vector:[] })
*/
export function get_line() {
  let params = Array.from(arguments);
  let numbers = params.filter((param) => !isNaN(param));
  let arrays = params.filter((param) => param.constructor === Array);
  if (params.length === 0) { return { vector: [], origin: [] }; }
  if (!isNaN(params[0]) && numbers.length >= 4) {
    return {
      origin: [params[0], params[1]],
      vector: [params[2], params[3]]
    };
  }
  if (arrays.length > 0) {
    if (arrays.length === 1) {
      return get_line(...arrays[0]);
    }
    if (arrays.length === 2) {
      return {
        origin: [arrays[0][0], arrays[0][1]],
        vector: [arrays[1][0], arrays[1][1]]
      };
    }
    if (arrays.length === 4) {
      return {
        origin: [arrays[0], arrays[1]],
        vector: [arrays[2], arrays[3]]
      };
    }
  }
  if (params[0].constructor === Object) {
    let vector = [], origin = [];
    if (params[0].vector != null)         { vector = get_vector(params[0].vector); }
    else if (params[0].direction != null) { vector = get_vector(params[0].direction); }
    if (params[0].origin != null)         { origin = get_vector(params[0].origin); }
    else if (params[0].point != null)     { origin = get_vector(params[0].point); }
    return { origin, vector };
  }
  return { origin: [], vector: [] };
}

export function get_ray(...args) {
  return get_line(...args);
}

export function get_two_vec2(...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_two_vec2(...args[0]);
  }
  const params = Array.from(args);
  const numbers = params.filter(param => !isNaN(param));
  const arrays = params.filter(o => typeof o === "object")
    .filter(param => param.constructor === Array);
  if (numbers.length >= 4) {
    return [
      [numbers[0], numbers[1]],
      [numbers[2], numbers[3]],
    ];
  }
  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }
  if (arrays.length === 1 && !isNaN(arrays[0][0][0])) {
    return arrays[0];
  }
  return undefined;
}

export function get_array_of_vec(...args) {
  if (args.length === 0) { return undefined; }
  if (args.length === 1 && args[0] !== undefined) {
    return get_array_of_vec(...args[0]);
  }
  // let params = Array.from(args);
  return Array.from(args);

  // let arrays = params.filter((param) => param.constructor === Array);
  // if (arrays.length == 1 && arrays[0].length > 0 && arrays[0][0].length > 0 && !isNaN(arrays[0][0][0])) {
  //   return arrays[0];
  // }
  // if (params[0].constructor === Object) {
  //   if (params[0].points != null) {
  //     return params[0].points;
  //   }
  // }
}


export function get_array_of_vec2() {
  // todo
  let params = Array.from(arguments);
  let arrays = params.filter((param) => param.constructor === Array);
  if (arrays.length >= 2 && !isNaN(arrays[0][0])) {
    return arrays;
  }
  if (arrays.length === 1 && arrays[0].length >= 1) {
    return arrays[0];
  }
  // if (arrays[0] != null && arrays[0].length >= 2 && arrays[0][0] != null && !isNaN(arrays[0][0][0])) {
  //  return arrays[0];
  // }
  return params;
}
