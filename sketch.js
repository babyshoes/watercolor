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
        // debugger
        this.length = this.findLength();
        this.midpoint = this.getMidpoint();
        this.orthogonalAngle = this.getAngleFromCenter();
    }

    findLength() {
        let a = this.first.x - this.second.x;
        let b = this.first.y - this.second.y;
        return Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
    }

    getMidpoint() {
        return new Point((this.first.x + this.second.x)/2, (this.first.y + this.second.y)/2)
    }

    getAngleRadians() {
        return Math.atan2(this.second.y - this.first.y, this.second.x - this.first.x);
    }

    getAngleFromCenter() {
        return Math.atan2(this.midpoint.y - center.y, this.midpoint.x - center.x);
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
            vertex,
            newX,
            newY
        // edge = new Edge(neighboringVertices);
        length = edge.length;
        // pick starting point on edge, vary a lil
        vertex = edge.midpoint;
        // pick angle for breaking edge
        angle = edge.orthogonalAngle;
        // + randomGaussian(HALF_PI, HALF_PI * .1)
        // pick magnitude of distortion, vary w/ length
        // magnitude = randomGaussian(1, .2) * length
        magnitude = length
        // magnitude = magnitude < 0 ? 0 : magnitude
        // get new vertex
        newX = this.projectX(vertex.x, angle, magnitude);
        newY = this.projectY(vertex.y, angle, magnitude);

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