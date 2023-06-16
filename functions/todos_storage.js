import { write } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { NotFoundError } from "./errors.js";
//lis le fichier json


const path = "./storage/todos.json"; //relatif au contexte d'exec

/**
 * @typedef {object} Todo //new type
 * @param {number} id
 * @param {string} title
 * @param {boolean} completed
 * @returns {Promise<Todo[]>} // methode async return promise array todo
 */

export async function findTodos () { // async car elle lis des fichiers, récup la liste des todo à faire

    //on commence à lire le fichier
    //pas besoin de stream (on utilise la totalité du fichier pour parse)

    const data = await readFile(path, "utf8"); // acquisition data au chemin indiqué + encodage type
    return JSON.parse(data); //parse la data 
}
/**
 * @param {string} title
 * @param {boolean} completed 
 * @returns {Promise<Todo>} // return promise ( lecture de fichier) avec todo en question
 */

export async function createTodo ({title , completed = false}) { // récup tache (POST => title et completed = false (défaut)), la sauvegarde base de donnée
    
    const newtodo = {
        title,
        completed,
        id : Date.now()
    }  // ma nouvelle tache puis assignation nouvelle id ( une date)
    
    const todos = [newtodo, ...await findTodos()];     // récup liste des tache (await findtodos()) pour avoir json complet et puch nouvelle tache au début (newtodo, ...)
    
    await writeFile(path , JSON.stringify(todos, null , 2)); // on écrit dans le fichier au chemin indiqué, le contenu sera un json.stringify
    
    return newtodo

}


/** 
 * @param {boolean} id
 * @returns {Promise} // return promise ( lecture de fichier) avec todo en question
 */

export async function removeTodo (id){ // supprime tache selon id dans delete requete

    const todos = await findTodos();  //on récupére tous les élément de l'array todos   qui ne corresponde pas à l'id fournit par la requete DEL de l'utilisateur pour les garder
    const todo = todos.findIndex(todo => todo.id === id); // vérifie si id fournit par requete correspond à un élément du tab ; si findindex trouve pas d'index correspondant il renvoie un -1
    if (todo === -1 ){
        throw new NotFoundError(); // fais rentrer l'eereur dans l'handleling Error natif via classe perso qui extend : notfounderror
    }
    await writeFile(path , JSON.stringify(todos.filter(todo => todo.id !== id), null , 2)); // réecrit les élement filtré dans le fichier json
    // pas de return, on ne renvoie rien

}

/**
 * @param {number} id
 * @param {{completed? : boolean, title? : string}} partialTodo

 * @returns {Promise<Todo>} // methode async return promise array todo
 */

export async function updateTodo( id , partialTodo){

    const todos = await findTodos();
    const todo = todos.find(todo => todo.id === id); // on cherche l'objet contenant à l'id fournit
    if ( todo === undefined){ // si find retourne undefined, obj à upsate n'existe pas
        throw new NotFoundError(); 
    }
    Object.assign(todo, partialTodo);
    await writeFile(path, JSON.stringify(todos, null , 2));
    return todo // partialTodo permet de résumer l'asignation à l'objet en 1 ligne ( l'objet à update contient automatiquement id,title et compléter)
}                                      // si c'est title à modif il rajoute automatiquement compléter, si c'est compléter à update il rajoute auto title