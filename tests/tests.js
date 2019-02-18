// convenience
function equivalent(a, b){ return Math.abs(a-b) < 1e-13; }
function equivalentArrays(a, b){
	return a.map((_,i) => Math.abs(a[i]-b[i]) < 1e-13).reduce((a,b) => a && b, true);
}
let Vector = Geometry.Vector;
let Matrix2 = Geometry.Matrix2;
let Line = Geometry.Line;
let Ray = Geometry.Ray;
let Edge = Geometry.Edge;
let Polygon = Geometry.Polygon;
let ConvexPolygon = Geometry.ConvexPolygon;

// all tests as objects: {
//    test: __boolean__,
//    name: __string__
//  }
let tests = [];
function test(t, name){ tests.push({test: t, name: name}); }


// 1. 2 vectors at 90 degrees: dot and cross
let v1 = Vector(Math.random()*2-1, Math.random()*2-1).normalize();
let v190 = v1.rotateZ90();
test(equivalent(v1.dot(v190), 0), "dot right angle");
test(equivalent(v1.cross(v190).magnitude(), 1), "cross right angle");

// 2. vector normalize, magnitude
let v2 = Vector(10,10).normalize().scale(2);
test(equivalent(v2.x, Math.sqrt(2)), "vector normalize, magnitude");

// 3. parallel
let v3a = Vector(3,4);
let v3b = Vector(-6,-8);
test(v3a.isParallel(v3b), "vector parallel");
let l3a = Line(100,101,3,4);
let l3b = Line(5,5,-6,-8);
test(l3a.isParallel(l3b), "line parallel");

// 4. equivalent
let v4a = Vector(3,4).normalize();
let v4b = Vector(6,8).normalize();
test(v4a.isEquivalent(v4b), "vectors equivalent");

// 5. intersection
let line1 = Line(10,0,-1,1);
let line2 = Line(0,0,1,1);
let ray1 = Ray(10,0,-1,1);
let ray2 = Ray(10,0,1,1);
let edge1 = Edge(10,0,0,10);
let edge2 = Edge(10,0,-1,1);

let intersect1 = line2.intersectLine(line1);
test(intersect1[0] === 5 && intersect1[1] === 5, "lines intersection");
let intersect2 = line2.intersectRay(ray1);
test(intersect2[0] === 5 && intersect2[1] === 5, "line-ray intersection");
let intersect3 = line2.intersectEdge(edge1);
test(intersect3[0] === 5 && intersect3[1] === 5, "line-edge intersection");

// 5. reflection matrices
let reflection1 = line1.reflection();
let reflection2 = ray1.reflection();
let reflection3 = edge1.reflection();
let matrixTest = equivalentArrays(reflection1.m, reflection2.m)
	&& equivalentArrays(reflection2.m, reflection3.m);
test(matrixTest, "reflection matrices");


// 5. polygon
let poly1 = Polygon.regularPolygon(4);
// poly1.clipLine(line1);

let poly2 = ConvexPolygon.regularPolygon(4);
// console.log(poly1);
let clip1 = poly2.clipLine(line1);



// check all tests
let allTests = tests.reduce((prev, curr) => prev && curr.test, true);
let result = allTests
	? "all tests pass"
	: "error with tests:<ul><li>"
		+ tests.filter(t=>!t.test).map(t=>t.name).join("</li><li>")
		+ "</li></ul>";
document.body.innerHTML = result;
