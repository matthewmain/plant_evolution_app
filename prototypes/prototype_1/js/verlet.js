


///////// VERLET.JS /////////




////---INITIATION---////


///canvas  (*canvas width & height must be equal to retain aspect ratio)
var canvasContainerDiv = document.getElementById("canvas_container_div");
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvRatio = 0.8;  // canvas ratio, as canvas size to lowest of window width or height

///trackers
var points = [], pointCount = 0;
var spans = [], spanCount = 0;
var skins = [], skinCount = 0;
var worldTime = 0;  // time as frame count

///settings
var gravity = 0.01;  // (rate of y-velocity increase per frame per point mass of 1)
var rigidity = 10;  // global span rigidity (as iterations of position accuracy refinement)
var friction = 0.999;  // (proportion of previous velocity after frame refresh)
var bounceLoss = 0.9;  // (proportion of previous velocity after bouncing)
var skidLoss = 0.8;  // (proportion of previous velocity if touching the ground)
var viewPoints = false;  // (point visibility)
var viewSpans = false;  // (span visibility)
var viewScaffolding = false; // (scaffolding visibility)
var viewSkins = true; // (skin visibility)
var breeze = 0.4;  // breeziness level (applied as brief left & right gusts)




////---OBJECTS---////


///point constructor
function Point(current_x, current_y, materiality="material") {  // materiality can be "material" or "immaterial"
  this.cx = current_x;
  this.cy = current_y; 
  this.px = this.cx;  // previous x value
  this.py = this.cy;  // previous y value
  this.mass = 1;  // (as ratio of gravity)
  this.materiality = materiality;
  this.fixed = false;
  this.id = pointCount;
  pointCount += 1;
}

///span constructor
function Span(point_1, point_2, visibility="visible") {  // visibility can be "visible" or "hidden"
  this.p1 = point_1;
  this.p2 = point_2;
  this.l = distance(this.p1,this.p2); // length
  this.strength = 1;  // (as ratio of rigidity)
  this.visibility = visibility;
  this.id = spanCount;
  spanCount += 1;
}

///skins constructor
function Skin(points_array,color) {
  this.points = points_array;  // an array of points for skin outline path
  this.color = color;
  this.id = skinCount;
  skinCount += 1;
}




////---FUNCTIONS---////


///scales canvas to window
function scaleToWindow() {
  if (window.innerWidth > window.innerHeight) {
    canvasContainerDiv.style.height = window.innerHeight*canvRatio+"px";
    canvasContainerDiv.style.width = canvasContainerDiv.style.height;
  } else {
    canvasContainerDiv.style.width = window.innerWidth*canvRatio+"px";
    canvasContainerDiv.style.height = canvasContainerDiv.style.width;
  }
}

///converts percentage to canvas x value
function xValFromPct(percent) {
  return percent * canvas.width / 100;
}

///converts percentage to canvas y value
function yValFromPct(percent) {
  return percent * canvas.height / 100;
}

///converts canvas x value to percentage of canvas width
function pctFromXVal(xValue) {
  return xValue * 100 / canvas.width;
}

///converts canvas y value to percentage of canvas height
function pctFromYVal(yValue) {
  return yValue * 100 / canvas.height;
}

///gets a point by id number
function getPt(id) {
  for (var i=0; i<points.length; i++) { 
    if (points[i].id == id) { return points[i]; }
  }
}

///gets distance between two points (pythogorian theorum)
function distance(point_1, point_2) {
  var x_difference = point_2.cx - point_1.cx;
  var	y_difference = point_2.cy - point_1.cy;
  return Math.sqrt( x_difference*x_difference + y_difference*y_difference);
}

///gets a span's mid point (returns object: { x: <value>, y: <value> } )
function smp(span) {
  var mx = ( span.p1.cx + span.p2.cx ) / 2;  // mid x value
  var my = ( span.p1.cy + span.p2.cy ) / 2;  // mid y value
  return { x: mx, y: my};
}

///removes a span by id
function removeSpan(id) {
  for( var i = 0; i < spans.length-1; i++){ 
    if ( spans[i].id === id) { spans.splice(i, 1); }
  }
}

///creates a point object instance
function addPt(xPercent,yPercent,materiality="material") {
  points.push( new Point( xValFromPct(xPercent), yValFromPct(yPercent), materiality ) );
  return points[points.length-1];
}

///creates a span object instance
function addSp(p1,p2,visibility="visible") {
  spans.push( new Span( getPt(p1), getPt(p2), visibility ) );
  return spans[spans.length-1];
}

///creates a skin object instance
function addSk(id_path_array, color) {
  var points_array = [];
  for ( var i=0; i<id_path_array.length; i++) {
    points_array.push(points[id_path_array[i]]);
  }
  skins.push( new Skin(points_array,color) );
  return skins[skins.length-1];
}

///updates point positions based on verlet velocity (i.e., current coord minus previous coord)
function updatePoints() {
  for(var i=0; i<points.length; i++) {
    var p = points[i];  // point object
    if (!p.fixed) {
      var	xv = (p.cx - p.px) * friction;	// x velocity
      var	yv = (p.cy - p.py) * friction;	// y velocity
      if (p.py >= canvas.height-1 && p.py <= canvas.height) { xv *= skidLoss; }
      p.px = p.cx;  // updates previous x as current x
      p.py = p.cy;  // updates previous y as current y
      p.cx += xv;  // updates current x with new velocity
      p.cy += yv;  // updates current y with new velocity
      p.cy += gravity * p.mass;  // add gravity to y
      if (worldTime % Tl.rib( 100, 200 ) === 0) { p.cx += Tl.rfb( -breeze, breeze ); }  // apply breeze to x
    }
  } 
}

///applies constrains
function applyConstraints( currentIteration ) {
  for (var i=0; i<points.length; i++) {
    var p = points[i];
    //wall constraints (inverts velocity if point moves beyond a canvas edge)
    if (p.materiality === "material") {
      if (p.cx > canvas.width) {
        p.cx = canvas.width;
        p.px = p.cx + (p.cx - p.px) * bounceLoss;
      }
      if (p.cx < 0) {
        p.cx = 0;
        p.px = p.cx + (p.cx - p.px) * bounceLoss;
      }
      if (p.cy > canvas.height) {
        p.cy = canvas.height;
        p.py = p.cy + (p.cy - p.py) * bounceLoss;
      }
      if (p.cy < 0) {
        p.cy = 0;
        p.py = p.cy + (p.cy - p.py) * bounceLoss;
      }
    }
  }
}

///updates span positions and adjusts associated points
function updateSpans( currentIteration ) {
  for (var i=0; i<spans.length; i++) {
    var thisSpanIterations = Math.round( rigidity * spans[i].strength );
    if ( currentIteration+1 <= thisSpanIterations ) {
      var s = spans[i];
      var dx = s.p2.cx - s.p1.cx;  // distance between x values
      var	dy = s.p2.cy - s.p1.cy;  // distance between y values
      var d = Math.sqrt( dx*dx + dy*dy);  // distance between the points
      var	r = s.l / d;	// ratio (span length over distance between points)
      var	mx = s.p1.cx + dx / 2;  // midpoint between x values 
      var my = s.p1.cy + dy / 2;  // midpoint between y values
      var ox = dx / 2 * r;  // offset of each x value (compared to span length)
      var oy = dy / 2 * r;  // offset of each y value (compared to span length)
      if (!s.p1.fixed) {
        s.p1.cx = mx - ox;  // updates span's first point x value
        s.p1.cy = my - oy;  // updates span's first point y value
      }
      if (!s.p2.fixed) {
        s.p2.cx = mx + ox;  // updates span's second point x value
        s.p2.cy = my + oy;  // updates span's second point y value
      }
    }
  }
}

///refines points for position accuracy & shape rigidity by updating spans and applying constraints iteratively
function refinePositions() {
  var requiredIterations = rigidity;
  for (var i=0; i<spans.length; i++) {
    var thisSpanIterations = Math.round( rigidity * spans[i].strength );
    if ( thisSpanIterations > requiredIterations ) {
      requiredIterations = thisSpanIterations;
    }
  }
  for (var j=0; j<requiredIterations; j++) {
    updateSpans(j);
    applyConstraints(i);
  }
}

///displays points
function renderPoints() {
  for (var i=0; i<points.length; i++) {
    var p = points[i];
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc( p.cx, p.cy, 3, 0 , Math.PI*2 );
    ctx.fill(); 
  }
}

///displays spans
function renderSpans() {
  for (var i=0; i<spans.length; i++) {
    var s = spans[i];
    if (s.visibility == "visible") {
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "blue";
      ctx.moveTo(s.p1.cx, s.p1.cy);
      ctx.lineTo(s.p2.cx, s.p2.cy);
      ctx.stroke(); 
    }
  }
}

///displays scaffolding & binding spans (i.e., "hidden" spans)
function renderScaffolding() {
  ctx.beginPath();
  for (var i=0; i<spans.length; i++) {
    var s = spans[i];
    if (s.visibility === "hidden") {
      ctx.strokeStyle="pink";
      ctx.moveTo(s.p1.cx, s.p1.cy);
      ctx.lineTo(s.p2.cx, s.p2.cy);
    }
  }
  ctx.stroke();
}

///displays skins 
function renderSkins() {
  for(var i=0; i<skins.length; i++) {
    var s = skins[i];
    ctx.beginPath();
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 0;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.fillStyle = s.color;
    ctx.moveTo(s.points[0].cx, s.points[0].cy);
    for(var j=1; j<s.points.length; j++) { ctx.lineTo(s.points[j].cx, s.points[j].cy); }
    ctx.lineTo(s.points[0].cx, s.points[0].cy);
    ctx.stroke();
    ctx.fill();  
  }
}

///clears canvas frame
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

///renders all visible components
function renderImages() {
  //if ( viewSkins ) { renderSkins(); }  // disabled here so plants can be rendered sequentially in plants.js
  if ( viewSpans ) { renderSpans(); }
  if ( viewPoints ) { renderPoints(); }
  if ( viewScaffolding ) { renderScaffolding(); }
}




////---EVENTS---////


///scaling
window.addEventListener('resize', scaleToWindow);




////---RUN---////


function runVerlet() {
	scaleToWindow();
  updatePoints();
  refinePositions();
  clearCanvas();
  renderImages();
  worldTime++;
}









