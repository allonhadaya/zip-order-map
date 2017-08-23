let completed = false;
const queue = [];

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

const ctx = document.getElementById('map').getContext('2d');

// receive coordinates from the worker
const worker = new Worker("/coordinates.js");
worker.onmessage = ({ data }) => {
  if (data === 'completed') {
    completed = true;
  } else {
    queue.push(data);
  }
};

const drawOne = () => {
  // we either read everything, or are waiting for more data
  if (!queue.length || completed) {
    return;
  }
  const [zip, x, y] = queue.shift();
  ctx.fillStyle = colors[+zip.toString()[0]];
  ctx.fillRect(x, y, 2, 2);
};

const draw = () => {
  console.log("draw");
  for (let j = 0; j < 5; j++) drawOne();
  if (!completed) window.requestAnimationFrame(draw);
};

window.requestAnimationFrame(draw);