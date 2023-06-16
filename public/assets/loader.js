import { createReadStream } from "node:fs";
import { assetsLog } from "../../functions/loggers.js";

export function Assets(endpoint, res) {
  if (endpoint.match(/.css/)) {
    assetsLog("Assets | CSS", "blue");
    res.setHeader("Content-Type", "text/css");
    createReadStream(`./public/assets/css/style.css`).pipe(res);
    return;
  }
  if (endpoint.match(/.js/)) {
    assetsLog("Assets | JS", "yellow");
    res.setHeader("Content-Type", "text/javascript");
    createReadStream(`./public/assets/loader.js`).pipe(res);
    return;
  }
}
