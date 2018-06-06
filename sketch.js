var watercolor,
    center;

function setup() {
    createCanvas(400, 400);
    center = new Point(width/2, height/2);
    watercolor = new Watercolor(center.x, center.y, 80, 10);
}

function draw() {
    background('rgba(255, 218, 119, .2)');
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
        this.length = this.findLength();
    }

    findLength() {
        let a = this.first.x - this.second.x;
        let b = this.first.y - this.second.y;
        return Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
    }

    getRandomMidpoint(num) {
        return new Point((this.first.x + this.second.x) * (1-num), (this.first.y + this.second.y) * (1-num));
    }

    getAngleRadians() {
        return Math.atan2(this.second.y - this.first.y, this.second.x - this.first.x);
    }

    getAngleFromCenter(midpoint) {
        return Math.atan2(midpoint.y - center.y, midpoint.x - center.x);
    }
}

class Watercolor {
    constructor(x, y, radius, npoints) {
        this.vertices = [];
        this.vertices = this.makePolygon(x, y, radius, npoints);
        this.vertices = this.distort();
    }

    paint() {
        fill('rgba(0, 195, 255, 0.58)');
        noStroke();
        beginShape();
        this.vertices.forEach( (pt) => { return vertex(pt.x, pt.y); } );
        endShape();
    }

    projectX(x, angle, r) {
        return x + cos(angle) * r;
    }

    projectY(y, angle, r) {
        return y + sin(angle) * r;
    }

    makePolygon(x, y, radius, npoints) {
        var angle,
            sx,
            sy
        var vertices = []
        angle = TWO_PI / npoints;
        for ( let i = 0; i < TWO_PI; i += angle ) {
            sx = x + cos(i) * radius;
            sy = y + sin(i) * radius;
            vertices.push( new Point(sx, sy) );
        }

        return vertices;
    }

    distortEdge(edge) {
        var length,
            angle,
            magnitude,
            midpoint,
            newX,
            newY
        length = edge.length;
        // pick starting point on edge, vary a lil
        midpoint = edge.getRandomMidpoint(random(0.45, 0.55));
        // midpoint = edge.getRandomMidpoint(0.5);
        // pick angle for breaking edge
        angle = edge.getAngleFromCenter(midpoint) * randomGaussian(1, .1);
        // pick magnitude of distortion, vary w/ length
        magnitude = randomGaussian(.5, .2) * length
        magnitude = magnitude < 0 ? 0 : magnitude
        // get new midpoint
        newX = this.projectX(midpoint.x, angle, magnitude);
        newY = this.projectY(midpoint.y, angle, magnitude);

        return new Point(newX, newY);
    }

    distort() {
        var edge,
            ptA,
            ptB,
            newVertex;
        var newVertices = []
        for ( let i=0; i<this.vertices.length; i++ ) {
            ptA = this.vertices[i];
            // wrap around to first vertex
            ptB = i == this.vertices.length-1 ? this.vertices[0] : this.vertices[i+1];

            edge = new Edge( [ptA, ptB] );
            newVertex = this.distortEdge(edge);
            newVertices.push(this.vertices[i],newVertex);
        }
        return newVertices;
        
    }
}