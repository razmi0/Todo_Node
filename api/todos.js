import { json } from "node:stream/consumers";
import { createTodo, findTodos, removeTodo, updateTodo } from "../functions/todos_storage.js";


export async function index(req , res) { //GET // permet de gerer la partie index
    return findTodos(); // recup liste des todo parsées
}

export async function create(req , res) { //POST
    //await + requete => streamconsumers.json// jsonify le body de la requete // renvoie todo à faire promesse
    return await createTodo(await json(req)); // createtodo à recup toute la liste dans le json et rajouter au début la nouvelle
}

export async function remove(req, res, url) { // DEL
    const id = parseInt(url.searchParams.get("id"),10); //cherche dans url.searchParams.get(id) founit par event en front et le parse en int (str sur url) base 10
    await removeTodo(id); 
    res.writeHead(204);
}

export async function update(req,res,url) {
    const id = parseInt(url.searchParams.get("id"), 10 ); // voir remove
    return updateTodo(id, await json(req) ); //await + streamconsumers.json =>  requete// jsonify le body de la requete // renvoie todo à faire promesse
}






// on remarque que deux fois res.write(JSON.strinfify(todo ou todos)) => on simplifie en simplifiant la fonction on retire =>
// de index
// res.write(JSON.stringify(todos)); //écrit dans le body, une version stringifié du JSON
//de create
//res.write(JSON.stringify(todo));// on renvoie la réponse avec la nouvelle tache comme enregistyrée dans le fichier