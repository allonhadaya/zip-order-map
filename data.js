// zip code projected coordinates in JSON Line format

console.error('compiling zip code centroids from census bureau shapefiles...');

const https = require('https');
const Zip = require('adm-zip');
const { extname } = require('path');
const shapefile = require('shapefile');
const { default: centroid } = require('@turf/centroid');

const merge = chunks => {

	console.error('merging data set buffers...');

	const totalLength = chunks.reduce((size, buffer) => size + buffer.length, 0);
	const buffer = new Buffer(totalLength);

	let position = 0;
	for (let chunk of chunks) {
		chunk.copy(buffer, position);
		position += chunk.length;
	}
	return buffer;
};

const unzip = buffer => {

	console.error('unzipping...');

	const zip = new Zip(buffer);

	let shp, dbf;
	for (let entry of zip.getEntries()) {
		switch (extname(entry.entryName)) {
			case '.shp':
				shp = entry.getData();
				break;
			case '.dbf':
				dbf = entry.getData();
				break;
		}
		if (shp && dbf) {
			return { shp, dbf };
		}
	}
	throw new Error('missing shp and/or dbf');
};

// https://www.census.gov/geo/maps-data/data/cbf/cbf_zcta.html
const zipCodeGeoJson = () => new Promise((resolve, reject) => {

	console.error('downloading...')

	https.get(
		'https://www2.census.gov/geo/tiger/GENZ2016/shp/cb_2016_us_zcta510_500k.zip',
		res => {

			if (res.statusCode !== 200) {
				return reject(new Error('failed to get zip code shapefile dataset: ' + res.statusCode));
			}

			const chunks = [];

			res.on('data', c => { chunks.push(c); }).on('end', () => {

				const { shp, dbf } = unzip(merge(chunks));
				resolve(shapefile.open(shp, dbf));

			});
		});
});

const collectFeatures = source => {

	console.error('collecting geojson features...');

	const features = [];

	return source.read().then(function repeat({ done, value }) {
		if (done) return features;
		features.push(value);
		return source.read().then(repeat);
	});
};

const toCentroids = ({ properties, geometry }) => centroid(geometry, { properties });

const byZipCode = ({ properties: { ZCTA5CE10: a } }, { properties: { ZCTA5CE10: b } }) => a.localeCompare(b);

const toZipLatLon = ({ properties: { ZCTA5CE10 }, geometry: { coordinates: [lat, lon] } }) => {
	// see https://gis.stackexchange.com/questions/8650/measuring-accuracy-of-latitude-and-longitude
	// "The third decimal place is worth up to 110 m: it can identify a large agricultural field or institutional campus."
	return `["${ZCTA5CE10}",${lat.toFixed(3)},${lon.toFixed(3)}]`;
};

const generateCoordinates = features => {

	console.error('generating coordinates...');

	return features
		.map(toCentroids)
		.sort(byZipCode)
		.map(toZipLatLon);
};

const out = lines => lines.forEach(line => console.log(line));

zipCodeGeoJson()
	.then(collectFeatures)
	.then(generateCoordinates)
	.then(out)
	.then(() => console.error('done.'));
