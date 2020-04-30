/**
 * Loading Controller module.
 * @module controllers/loadingController
 */
// requires model and view
let view=require('../views/loadingView');
model= require('../models/loadingModel');

exports.getBody = (req,res) => {
    view.print(req,res);
}

/**
 * Funzione per ​recuperare il livello di progressione tramite il
 * loadingModel e produrre una nuova barra di progressione XHTML aggiornata
 * @param {object} res - Rappresenta un oggetto XHTML da ritornare
 */
exports.getUpdatedBar = (res) => {
    const progression = model.getProgression();
    view.generateProgressBar(res,progression);
}