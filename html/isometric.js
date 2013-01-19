(function(window, undefined) {

var canvas;

var dY = 0.5;
var dX = Math.sqrt(1*1 - 0.5*0.5);

var N = 32;
var cubes = {};
function setCube(u, v, w) {
    if (w == 0)
	delete cubes[u + ',' + v];
    else
	cubes[u + ',' + v] = w;
}
function getCube(u, v) {
    return cubes[u + ',' + v] || 0;
}

function getNeighbors(u, v) {
    // six neighboring cubes, clockwise from top
    return [getCube(u + 1, v - 1),
	    getCube(u + 1, v),
	    getCube(u, v + 1),
	    getCube(u - 1, v + 1),
	    getCube(u - 1, v),
	    getCube(u, v - 1)];
}

function polygon(c, vertices) {
    c.beginPath();
    c.moveTo(vertices[0], vertices[1]);
    for (var i = 2; i < vertices.length; i += 2)
	c.lineTo(vertices[i], vertices[i + 1]);
    c.closePath();
    return c;
}

function leftTriangle(r) {
    return [r[0], r[1],
	    r[4], r[5],
	    r[6], r[7]];
}

function rightTriangle(r) {
    return [r[0], r[1],
	    r[2], r[3],
	    r[4], r[5]];
}

function fillCube(c, u, v) {
    var w = getCube(u, v);
    if (!w) return;

    c.save();
    c.translate(u + v - 1, v - u - 1);

    var neighbors = getNeighbors(u, v);
    var rhombus;

    if (w >= neighbors[0]) {
	// top
	c.fillStyle = '#ffffff';
	rhombus = [1, 0,
		   2, 1,
		   1, 2,
		   0, 1];
	if (w >= neighbors[5] && w >= neighbors[1])
	    polygon(c, rhombus).fill();
	else if (w >= neighbors[5])
	    polygon(c, leftTriangle(rhombus)).fill();
	else if (w >= neighbors[1])
	    polygon(c, rightTriangle(rhombus)).fill();
    }

    if (w > neighbors[4]) {
	// left
	c.fillStyle = '#555555';
	rhombus = [1, 2,
		   1, 4,
		   0, 3,
		   0, 1];
	if (w >= neighbors[5] && w > neighbors[3])
	    polygon(c, rhombus).fill();
	else if (w >= neighbors[5])
	    polygon(c, leftTriangle(rhombus)).fill();
	else if (w > neighbors[3])
	    polygon(c, rightTriangle(rhombus)).fill();
    }

    if (w >= neighbors[2]) {
	// right
	c.fillStyle = '#aaaaaa';
	rhombus = [1, 2,
		   2, 1,
		   2, 3,
		   1, 4];
	if (w > neighbors[3] && w >= neighbors[1])
	    polygon(c, rhombus).fill();
	else if (w > neighbors[3])
	    polygon(c, leftTriangle(rhombus)).fill();
	else if (w >= neighbors[1])
	    polygon(c, rightTriangle(rhombus)).fill();
    }

    c.restore();
}

function strokeCube(c, u, v) {
    c.save();
    c.translate(u + v - 1, v - u - 1);

    var hexagon = [1, 0,
		   2, 1,
		   2, 3,
		   1, 4,
		   0, 3,
		   0, 1];
    c.strokeStyle = '#00f8f8';
    polygon(c, hexagon).stroke();

    c.restore();
}

var mouseU, mouseV;

function draw() {
    var c = canvas[0].getContext('2d');

    c.clearRect(0, 0, 2 * N, 2 * N);
    for (var v = 0; v < 2*N; v++) {
	for (var u = -N; u < N; u++)
	    fillCube(c, u, v);
    }

    if (mouseU !== undefined && mouseV !== undefined)
	strokeCube(c, mouseU, mouseV);
}

function fromPixel(pageX, pageY) {
    var offset = canvas.offset();
    var x = pageX - offset.left;
    var y = pageY - offset.top;

    x *= N / canvas[0].width / dX; // = u + v
    y *= N / canvas[0].height / dY; // = v - u
    return {u: Math.round((x - y) / 2),
	    v: Math.round((x + y) / 2)};
}

function doClick(p) {
    var w = getCube(p.u, p.v);
    var neighbors = getNeighbors(p.u, p.v).sort();
    if (w == 0) // create a new cube behind all neighbors
	w = Math.max(1, neighbors[0] - 1); // currently depth must be positive
    else { // move to the next depth
	for (var i = 0; i < 6 && w > neighbors[i]; i++);
	if (i == 6) // we are in front already, so now disappear
	    w = 0;
	else
	    w = neighbors[i] + 1;
    }
    setCube(p.u, p.v, w);

    draw();
}

var dragging = false;
function mousedown(e) {
    dragging = true;
    doClick(fromPixel(e.pageX, e.pageY));
}
function mousemove(e) {
    var p = fromPixel(e.pageX, e.pageY);
    if (mouseU != p.u || mouseV != p.v) {
	mouseU = p.u;
	mouseV = p.v;

        if (dragging) doClick(p);
	else draw();
    }
}
function mouseup(e) {
    dragging = false;
}

// for (var v = 0; v < 2*N; v++) {
//     for (var u = -N; u < N; u++) {
// 	if (Math.random() < 0.1)
// 	    setCube(u, v, Math.ceil(3 * Math.random()));
//     }
// }

var convection = false;
var tick = 1; // so we only convect a given cube once per round
(function convect() {
    if (convection && !dragging) {
        for (var v = 0; v < 2*N; v++) {
            for (var u = -N; u < N; u++) {
                var w = getCube(u, v);
                if (w > 0 && w < tick) {
                    setCube(u, v, 0);
                    if (u < N && v > 0) {
                        if (Math.random() < 0.5)
                            setCube(u + 1, v - 1, tick);
                        if (Math.random() < 0.25)
                            setCube(u + 1, v - 2, tick);
                        if (Math.random() < 0.25)
                            setCube(u + 2, v - 1, tick);
                        if (Math.random() < 0.25)
                            setCube(u + 2, v - 2, tick);
                    }
                }
            }
        }
        tick++;

        if (tick % 3 == 0)
            setCube(-12, 24, 1);
        if (tick % 5 == 0)
            setCube(-12, 26, 1);
        if (tick % 7 == 0)
            setCube(-12, 30, 1);

        draw();
    }

    setTimeout(convect, 300);
})();

$(function() {
    canvas = $('#isometric');
    canvas.mousedown(mousedown);
    canvas.mousemove(mousemove);
    $(window).mouseup(mouseup);

    canvas.mouseleave(function() {
        mouseU = mouseV = undefined; // stop drawing the mouse outline
        draw();
    });

    // if we don't do this, then double-clicking on the canvas ends up selecting nearby text :/
    canvas.on('selectstart', function(e) {
        e.preventDefault();
    });

    var c = canvas[0].getContext('2d');
    c.scale(canvas[0].width / N * dX, canvas[0].height / N * dY);
    c.lineWidth = 2 * N / dX / canvas[0].width;

    draw();
    convection = true;
});

})(this);
