/**
 * Loading Controller module.
 * @module controllers/loadingController
 */
// requires model and view
const view = require('../views/loadingView');
//TODO remove the reference also from the Dev manual
//const model = require('../models/loadingModel');

/**
 * Funzione per ​stampare la progress bar iniziale
 * @param {object} res - Rappresenta un oggetto XHTML da ritornare
 */
exports.getBody = (res) => {
    view.print(res)
}

//TODO remove also from manual
// /** Funzione per ​recuperare il livello di progressione tramite il
//  * loadingModel e produrre una nuova barra di progressione XHTML aggiornata
//  * @param {object} res - Rappresenta un oggetto XHTML da ritornare
//  */
// exports.getUpdatedBar = (res) => {
//     const progression = model.getProgression();
//     view.generateProgressBar(res,progression);
// }