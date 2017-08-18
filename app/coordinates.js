// polyfill window.ReadableStream
const { ReadableStream } = require("web-streams-polyfill");
window.ReadableStream = ReadableStream;

// a streaming fetch interface
const fetchStream = require('fetch-readablestream')

// parses an incoming response stream as line delimited json documents
const jsonlStream = require('can-ndjson-stream');

// abstract incoming coordinates as a reactive observable
const { Observable } = require('rx-lite');

module.exports = Observable.create(observer => {

  fetchStream('/coordinates.jsonl')
    .then(({ body }) => jsonlStream(body))
    .then(coordinateStream => {

      const reader = coordinateStream.getReader();

      // consume all reader values and publish them to the observer
      reader.read().then(function read({ value, done }) {
        if (done) {
          observer.completed();
        } else {
          observer.next(value);
          // continue
          reader.read().then(read);
        }
      });

    });
});