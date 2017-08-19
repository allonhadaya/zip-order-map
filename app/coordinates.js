const { Observable } = require('rx-lite');

module.exports = Observable.create(observer => {

  let offset = 0;

  function onProgress(e) {

    while (true) {
      const end = this.responseText.indexOf("\n", offset);
      if (end === -1) break;
      const line = this.responseText.substring(offset, end);
      observer.next(JSON.parse(line));
      offset = end + 1;
    }

  }

  function onComplete(e) {
    const lastLine = this.responseText.substring(offset);
    observer.next(JSON.parse(lastLine));
    observer.completed();
  }

  var request = new XMLHttpRequest();

  request.addEventListener("progress", onProgress);
  request.addEventListener("load", e => onComplete);
  request.addEventListener("error", e => observer.error());
  request.addEventListener("abort", e => observer.cancel());

  request.open("GET", "/coordinates.jsonl");
  request.send();

});