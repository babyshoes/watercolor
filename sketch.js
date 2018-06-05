function setup() {
 createCanvas(400, 400);
}

function draw() {
    background('rgba(255, 218, 119, 0.5)');
    watercolor = new Watercolor(width/2, height/2, 80, 8);
    watercolor.paint();
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Edge {
    constructor(points){
        this.first = points[0];
        this.second = points[1];
    }

    findLength(vertices) {
        return Math.pow(Math.pow(Math.abs(this.first.x - this.second.x), 2) + Math.pow(Math.abs(this.first.x - this.second.x), 2), 0.5);
    }

    getMidpoint(vertices) {
        return new Point((this.first.x + this.second.x)/2, (this.first.y + this.second.y)/2)
    }
}

class Watercolor {
    constructor(x, y, radius, npoints) {
        this.vertices = [];
        this.makePolygon(x, y, radius, npoints);
    }

    paint() {
        fill('rgba(0, 195, 255, 0.58)');
        noStroke();
        beginShape();
        this.vertices.forEach( (pt) => { return vertex(pt.x, pt.y); } );
        endShape();
    }

    makePolygon(x, y, radius, npoints) {
        var angle,
            sx,
            sy
        angle = TWO_PI / npoints;
        for (let i=0; i < TWO_PI; i+=angle) {
            sx = x + cos(i) * radius;
            sy = y + sin(i) * radius;
            this.vertices.push(new Point(sx, sy));
        }
    }

    distort(neighboringVertices) {
        var length,
            angle,
            magnitude,
            vertex
        length = getEdge(neighboringVertices);
        // pick starting point on edge, vary a lil
        vertex = getMidpoint(vertices);
        // pick angle for breaking edge
        angle = randomGaussian(HALF_PI, HALF_PI * .1)
        // pick magnitude of distortion, vary w/ length

        // get new vertex
    }
}