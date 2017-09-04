const colors = [
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

let dotsPerSecond = 50;
const followPeriod = 5;
const dotsToScaleFor = dotsPerSecond * followPeriod;

// update draw speed when the mouse moves
window.addEventListener("mousemove", ({ clientX }) => {
  dotsPerSecond = Math.ceil(5000 * clientX / window.innerWidth);
});

// receive coordinates from a web worker
let completed = false;
const coordinates = [];
(new Worker("coordinates.js")).onmessage = ({ data }) => {
  if (data === 'completed') {
    completed = true;
  } else {
    coordinates.push(data);
  }
};

let state = {
  timestamp: new Date(),
  to: 0
};

const advance = previous => {

  const next = {
    timestamp: new Date(),
    from: previous.to,
    done: false
  };

  const timeElapsed = next.timestamp - previous.timestamp;
  const dotsToRender = Math.ceil(timeElapsed * dotsPerSecond / 1000);

  next.to = next.from + dotsToRender;
  next.scaleUntil = next.from + dotsToScaleFor;

  if (next.to > coordinates.length) {
    if (completed) {
      next.done = true;
    } else {
      console.log(`rendering ${next.to - coordinates.length} too few coordinates because they are not yet loaded`);
    }
    next.to = coordinates.length;
  }

  return next;
};

const ctx = document.getElementById('map').getContext('2d');

const draw = () => {

  state = advance(state);
  let { done, from, to } = state;

  while(from < to) {
    const [zip, x, y] = coordinates[from];
    ctx.fillStyle = colors[+zip.toString()[0]];
    ctx.fillRect(x, y, 2, 2);
    from++;
  }

  if (done) {
    console.log("drawing all done");
    return;
  }
  window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);
