const coordinates = require('./coordinates');

const p5 = require('p5');
const Mappa = require('mappa-mundi');

const options = {
    // lng: -91.32199773656683, lat: 33.25722241533237, zoom: 7,
    lat: 39.5,
    lng: -96.35,
    zoom: 3.2,
    width: 1200,
    height: 640,
    scale: 1,
};

const mappa = new Mappa();
const map = mappa.staticMap(options);

// start the sketch
new p5(p => {

  let allDone = false;
  let queue = [];
  let colors;

  coordinates.subscribe({
    onNext: coordinate => queue.push(coordinate),
    onComplete: () => allDone = true,
    onError: err => console.log(err)
  })

  const drawOne = () => {
    // we either read everything, or are waiting for more data
    if (!queue.length) {
      if (allDone) {
        p.noLoop();
      }
      return;
    }
    const [zip, long, lat] = queue.shift();
    const point = map.latLngToPixel(lat, long);
    p.fill(colors[+zip.toString()[0]])
    p.rect(point.x, point.y, 2, 2);
  };

  p.setup = () => {
    p.createCanvas(1200, 640);
    p.noStroke();
    colors = [p.color(255,140,0), p.color(255,213,0), p.color(153,255,0), p.color(0,255,221), p.color(0,200,255), p.color(0,115,255), p.color(72,0,255), p.color(255,0,221), p.color(255,0,111), p.color(255,0,9)]
  };

  p.draw = () => {
    for (let j = 0; j < 5; j++) drawOne();
  };

});