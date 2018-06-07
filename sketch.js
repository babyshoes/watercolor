var watercolor,
    center,
    numSides,
    radius,
    ogDeformationTimes,
    addlDeformationTimes,
    numLayers,
    opacity,
    layer;

numSides = 10;
radius = 100;

numLayers = 50;
ogDeformationTimes = 7;
addlDeformationTimes = 4;
opacity = 0.02;

// testing params
// numLayers = 1;
// ogDeformationTimes = 3;
// addlDeformationTimes = 0;
// opacity = 0.5;

function setup() {
    
    createCanvas(600, 600);
    center = new Point(width/2, height/2);
    // background('rgba(255, 218, 119, .1)');
    watercolor = new Watercolor(center.x, center.y, radius, numSides, ogDeformationTimes);
    for ( let i=0; i < numLayers; i++ ) {
        // i think it looks more nicely diffuse at edges to have layers be slightly smaller?
        layer = new Watercolor(center.x, center.y, radius * (4/5), numSides, 
            addlDeformationTimes, watercolor.vertices);
        
        layer.paint();
        window.layer = null;
        delete window.layer;
    }
}

function draw() {
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
            var newY = this.slope * (newX - this.first.x) + this.first.y
        } else {
            var newX = this.first.x;
            var newY = (this.second.y - this.first.y) * num + this.first.y
        }
        return new Point(newX, newY);
    }

    getAngleRadians() {
        return Math.atan2(this.second.y - this.first.y, this.second.x - this.first.x);
    }

    getAngleFromCenter(midpoint) {
        return Math.atan2(midpoint.y - center.y, midpoint.x - center.x);
    }
}

class Watercolor {
    constructor(x, y, radius, npoints, numDeformations, vertices=[]) {
        this.vertices = vertices;
        this.vertices = this.vertices.length === 0 ? this.makePolygon(x, y, radius, npoints) : this.vertices;
        for ( let i=0; i < numDeformations; i++ ){
            this.vertices = this.distort();
        }
    }

    paint() {
        fill(`rgba(191, 157, 221, ${opacity})`);
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

    bound(num, min, max=-999) {
        num = num < min ? min : num
        if ( max != -999 ) {
            num = num > max ? max : num
        }
        return num
    }

    distortEdge(edge) {
        // pick starting point on edge, vary a lil
        var midpoint = edge.getRandomMidpoint( randomGaussian( 0.5, 0.3 ) );

        // pick angle for breaking edge
        var angle = edge.getAngleFromCenter(midpoint) + randomGaussian(0, 2);

        // pick magnitude of distortion, vary w/ length
        var magnitude = this.bound( randomGaussian(.3, .2), 0.1 ) * edge.length;

        // get new midpoint
        var newX = this.projectX(midpoint.x, angle, magnitude);
        var newY = this.projectY(midpoint.y, angle, magnitude);

        return new Point(newX, newY);
    }

    distort() {
        var newVertices = [];
        const lastIndex = this.vertices.length-1;
        for ( let i=0; i<this.vertices.length; i++ ) {
            var ptA = this.vertices[i];
            // wrap around to first vertex
            var ptB = i === lastIndex ? this.vertices[0] : this.vertices[i+1];

            var edge = new Edge( [ptA, ptB] );
            var newVertex = this.distortEdge(edge);
            newVertices.push(this.vertices[i],newVertex);
        }

        return newVertices;
        
    }
}