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
    res.setHeader("Content-Type", "application/json"); //?set content type de l'header reponse

    const url = new URL(req.url, `http://${req.headers.host}`); //? on récupére url demandé par emeteur et on créer un objet url

    //? on représente le endpoint pour ne pas imbriquer les requetes ( POST:/todos ou GET:/todos) endpoint = info résumant la demande du client (req.method + url.pathname)
    const endpoint = `${req.method}:${url.pathname}`;

    reqLog(endpoint);
    reqLog(url.searchParams.get("name"));
    Assets(endpoint, res);

    let results; //? stocke le return index de get/create de post

    switch (endpoint) {
      case "GET:/":
        res.setHeader("Content-Type", "text/html"); //? on signale que le body est un text/html pour que navigateur fasse l'interprétation
        createReadStream(`${publicPath}index.html`).pipe(res); //? on lit le fichier html que l'on pipe dans la réponse
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
        res.writeHead(404); //? déso je t'envoie un 404 dans le header
    }
    if (results) {
      res.write(JSON.stringify(results)); //? stringify le résultat parsé de create ou index ou update => l'écrit dans le body de reponse
    }
  } catch (e) {
    //? e est une var d'handleling de l'erreur

    if (e instanceof NotFoundError) {
      //? sachant que NotFoundError va faire planter alors on prévient en catch l'appel à NotFoundError avec e puis => 404 sans plantage serveur
      res.writeHead(404); //? déso je t'envoie un 404 dans le header
    } else {
      throw e; //? si c'est pas un notfound et je la gere deja pas, je fais planter mon serveur //? creer un nouveau fichier d'écriture erreur genre un log ?
    }
  }
  res.end();

  //? si POST pas valable, on bloque le script et fais planté le serveur  => entouré le code de try catch et renvoyer typequement un rep code 500
  //? code pas trés lisible avec toute ces conditions => on creer api/todos pour s'ocupper de
}).listen(8888);
