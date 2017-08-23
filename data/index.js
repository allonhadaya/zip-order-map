const projection = require('d3-geo').geoAlbersUsa();
const centroid = require('@turf/centroid');
const truncate = require('@turf/truncate');
const topo = require('topojson-client');
const data = require('./zips_us_topo.json');

const features = () => topo.feature(data, data.objects.zip_codes_for_the_usa).features;

const toCentroids = ({ properties, geometry }) => centroid(geometry, properties);

const byZipCode = ({ properties: { zip: a } }, { properties: { zip: b } }) => a.localeCompare(b);

const toZipXY = ({ properties: { zip }, geometry: { coordinates } }) => {
  var xy = projection(coordinates);
  xy.unshift(zip);
  return xy;
};

const orderedCentroids =
  features()
    .map(toCentroids)
    .sort(byZipCode)
    .map(toZipXY);


module.exports = orderedCentroids;
