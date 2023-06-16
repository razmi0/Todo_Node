import { createServer } from "node:http";

import { index, create, remove, update } from "./api/todos.js";
import { NotFoundError } from "./functions/errors.js";
import { createReadStream } from "node:fs";
import { Chalk } from "chalk";
import Fastify from "fastify";
import { Assets } from "./public/assets/loader.js";
import { reqLog } from "./functions/loggers.js";

const fastify = Fastify({
  logger: true,
});

const publicPath = "./public/";

createServer(async (req, res) => {
  try {
    res.setHeader("Content-Type", "application/json");

    const url = new URL(req.url, `http://${req.headers.host}`);

    const endpoint = `${req.method}:${url.pathname}`;

    reqLog(endpoint);
    reqLog(url.searchParams.get("name"));
    Assets(endpoint, res);

    let results;

    switch (endpoint) {
      case "GET:/":
        res.setHeader("Content-Type", "text/html");
        createReadStream(`${publicPath}index.html`).pipe(res);
        return;

      case "GET:/todos":
        results = await index(req, res);
        break;

      case "POST:/todos":
        results = await create(req, res);
        break;

      case "DELETE:/todos":
        results = await remove(req, res, url);
        break;

      case "PUT:/todos":
        results = await update(req, res, url);
        break;

      default:
        res.writeHead(404);
    }
    if (results) {
      res.write(JSON.stringify(results));
    }
  } catch (e) {
    if (e instanceof NotFoundError) {
      res.writeHead(404);
    } else {
      throw e;
    }
  }
  res.end();
}).listen(8888);
