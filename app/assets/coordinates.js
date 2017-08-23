let offset = 0;

function onProgress(e) {

  console.log('emitting block', offset, e);

  while (true) {
    const end = this.responseText.indexOf("\n", offset);
    if (end === -1) break;
    const line = this.responseText.substring(offset, end);
    postMessage(JSON.parse(line));
    offset = end + 1;
  }

  console.log('emitted block', offset);

}

function onComplete(e) {
  const lastLine = this.responseText.substring(offset);
  postMessage(JSON.parse(lastLine));
  postMessage('completed');
}

var request = new XMLHttpRequest();

request.addEventListener("progress", onProgress);
request.addEventListener("load", e => onComplete);
request.addEventListener("error", e => {/*throw*/});
request.addEventListener("abort", e => {/*throw*/});

request.open("GET", "/coordinates.jsonl", true);
request.send(null);
