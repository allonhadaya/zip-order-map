module.exports = {
  files: {
    javascripts: {joinTo: 'app.js'}
  },
  hooks: {
    preCompile() {
      // generate the coordinates
      require('fs').writeFileSync('app/assets/coordinates.jsonl', require('./data'));
      return Promise.resolve();
    }
  }
};
