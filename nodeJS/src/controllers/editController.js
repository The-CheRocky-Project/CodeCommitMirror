// editController module
// requires model and view
let view=require('../views/editView');
model= require('../models/editModel');

/**
 * Effettua il rendering del body della pagina di visualizzazione dei risultati dell'elaborazione.
 * @param {object} res - Rappresenta la risposta http
 */
exports.getBody = (res) => {
    view.print(res);
}

/**
 * Imposta la modalità di visualizzazione su original oppure preview
 * @param {boolean} toOriginal - Indica se si vuole passare alla modalità original (true) oppure preview (false)
 */
exports.changeVideoMode = (toOriginal) => {
    if(toOriginal)
        return model.setOriginalMode();
    else
        return model.setPreviewMode();
};
