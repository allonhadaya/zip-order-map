let offset = 0;

function postCoordinates(e) {
  while (true) {

    // find the end of the next line
    const end = this.responseText.indexOf("\n", offset);
    if (end === -1) break;

    // dispatch this line
    const line = this.responseText.substring(offset, end);
    postMessage(JSON.parse(line));

    // advance the offset past the parsed messages
    offset = end + 1;
  }
}

function onComplete() {

  // the last message is still not sent
  const lastLine = this.responseText.substring(offset);
  postMessage(JSON.parse(lastLine));

  // let the client know they have everything
  postMessage('completed');
  close();
}

function failSilently() {
  // let the client know there are no more coordinates coming
  // (fail silently for now)
  postMessage('completed');
  close();
}

var request = new XMLHttpRequest();

request.addEventListener("progress", postCoordinates);
request.addEventListener("load", onComplete);
request.addEventListener("error", failSilently);
request.addEventListener("abort", failSilently);

request.open("GET", "/coordinates.jsonl", true);
request.send(null);
