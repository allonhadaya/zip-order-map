const centroid = require('@turf/centroid');
const truncate = require('@turf/truncate');
const topo = require('topojson-client');
const data = require('./zips_us_topo.json');

const features = () => topo.feature(data, data.objects.zip_codes_for_the_usa).features;

const toCentroids = ({ properties, geometry }) => centroid(geometry, properties);

const byZipCode = ({ properties: { zip: a } }, { properties: { zip: b } }) => a.localeCompare(b);

const toTuple = ({ properties: { zip }, geometry: { coordinates: [long, lat] } }) => [zip, long, lat];

const toLowerResolution = f => truncate(f, 4, 3, true);

const orderedCentroids =
  features()
    .map(toCentroids)
    .sort(byZipCode)
    .map(toLowerResolution)
    .map(toTuple);


module.exports = orderedCentroids;