// zip code coordinates in JSON Line format
const zips = () => require('./data').map(JSON.stringify).join('\n');

module.exports = {
  files: {
    javascripts: {joinTo: 'app.js'},
    stylesheets: {joinTo: 'app.css'}
  },
  hooks: {
    preCompile() {
      require('fs').writeFileSync('app/assets/coordinates.jsonl', zips());
      return Promise.resolve();
    }
  }
};
