var colors = [
  'rgb(255,140,0)',
  'rgb(255,213,0)',
  'rgb(153,255,0)',
  'rgb(0,255,221)',
  'rgb(0,200,255)',
  'rgb(0,115,255)',
  'rgb(72,0,255)',
  'rgb(255,0,221)',
  'rgb(255,0,111)',
  'rgb(255,0,9)'
];

var dotsPerSecond = 50;
var followPeriod = 5;
var dotsToScaleFor = dotsPerSecond * followPeriod;

// update draw speed when the mouse moves
window.addEventListener("mousemove", function(ev) {
  dotsPerSecond = Math.ceil(5000 * ev.clientX / window.innerWidth);
});

// receive coordinates from a web worker
var completed = false;
var coordinates = [];
(new Worker("coordinates.js")).onmessage = function(msg) {
  if (msg.data === 'completed') {
    completed = true;
  } else {
    coordinates.push(msg.data);
  }
};

var state = {
  timestamp: new Date(),
  to: 0
};

var advance = function(previous) {

  var next = {
    timestamp: new Date(),
    from: previous.to,
    done: false
  };

  var timeElapsed = next.timestamp - previous.timestamp;
  var dotsToRender = Math.ceil(timeElapsed * dotsPerSecond / 1000);

  next.to = next.from + dotsToRender;
  next.scaleUntil = next.from + dotsToScaleFor;

  if (next.to > coordinates.length) {
    if (completed) {
      next.done = true;
    } else {
      console.log('rendering', next.to - coordinates.length, 'too few coordinates because they are not yet loaded');
    }
    next.to = coordinates.length;
  }

  return next;
};

var ctx = document.getElementById('map').getContext('2d');

var draw = function() {

  state = advance(state);

  var c, zip, firstDigit, x, y;

  for (var i = state.from; i < state.to; i++) {
    c = coordinates[i];
    zip = c[0];
    x = c[1];
    y = c[2];
    firstDigit = +zip.toString()[0];
    ctx.fillStyle = colors[firstDigit];
    ctx.fillRect(x, y, 2, 2);
  }

  if (state.done) {
    console.log("drawing all done");
    return;
  }
  window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);
