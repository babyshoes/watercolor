var watercolor,
    center,
    numSides,
    deformationTimes,
    numLayers,
    opacity;

numSides = 10;
// numLayers = 100;
// deformationTimes = 5;
// opacity = 0.04;

numLayers = 1;
deformationTimes = 1;
opacity = 0.5;

function setup() {
    
    createCanvas(600, 600);
    center = new Point(width/2, height/2);
    // background('rgba(255, 218, 119, .1)');
    for (let i=0; i < numLayers; i++) {
        watercolor = new Watercolor(center.x, center.y, 30, numSides);
        watercolor.paint();
    }
}

function draw() {

    // watercolor.paint();
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
        this.slope = this.findSlope();
    }

    findSlope() {
        return (this.second.y - this.first.y) / (this.second.x - this.first.x)
    }

    findLength() {
        let a = this.first.x - this.second.x;
        let b = this.first.y - this.second.y;
        return Math.pow(Math.pow(a, 2) + Math.pow(b, 2), 0.5);
    }

    getRandomMidpoint(num) {
        if ( this.first.x != this.second.x ) {
            var newX = (this.second.x - this.first.x) * num + this.first.x
            var newY = this.slope * (this.second.x - this.first.x) + this.first.y
        } else {
            var newX = this.first.x;
            var newY = (this.second.y - this.first.y) * num + this.first.y
        }
        return new Point(newX, newY);
        // return new Point((this.first.x + this.second.x) * (1-num), (this.first.y + this.second.y) * (1-num));
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
        for ( let i=0; i < deformationTimes; i++ ){
            this.vertices = this.distort();
        }
        
    }

    paint() {
        fill(`rgba(0, 195, 255, ${opacity})`);
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

    boundMin(num, min) {
        // debugger
        num = num < min ? min : num
        return num
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
        // var midpointMultiplier = this.boundMin( randomGaussian( 0.5, 0.04), 0.1 );
        var midpointMultiplier = randomGaussian( 0.5, 0.04 )
        // console.log(midpointMultiplier)
        midpoint = edge.getRandomMidpoint( midpointMultiplier );
        // midpoint = edge.getRandomMidpoint(0.5);
        // pick angle for breaking edge
        // var angleMultiplier = this.boundMin( randomGaussian(1, .2), 0.1 );
        var angleMultiplier = 1
        angle = edge.getAngleFromCenter(midpoint) * angleMultiplier;
        // pick magnitude of distortion, vary w/ length
        // magnitude = this.boundMin( randomGaussian(.5, .1), 0.1 ) * length
        magnitude = 1 * length
        // magnitude = magnitude < 0 ? 0 : magnitude
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