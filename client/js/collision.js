/**
 * Copyright: (c) 2015 Max Klein
 * License: MIT
 */

// Circle to rect collision: http://stackoverflow.com/a/402010/3593126

// TODO: better collision detection

//function createCollider(data) {
//	switch(data.type) {
//		case "box": return new BoxCollider(data);
//		case "circle": return new CircleCollider(data);
//		default: throw new TypeError("Invalid constructor type");
//	}
//}

// TODO!!

function circleCollision(x1, y1, r1, x2, y2, r2) {
	// X distance
	var dx = x2 - x1;

	// Y distance
	var dy = y2 - y1;

	// Minimium allowed distance
	var d = r1 + r2;

	// Pythagorean theorem
	return (dx * dx + dy * dy) <= d * d;
}

function specialCollision(
	chickenX, chickenY, chickenW, chickenH,
	objectX, objectY,
	objectCollider
) {
	function Object() {
		return {};
	}
}
