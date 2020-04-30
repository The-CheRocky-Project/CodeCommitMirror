// editController module
// requires model and view
const view = require('../views/editView');
const model = require('../models/editModel');

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
 * @returns {boolean} true se la richiestra di cambio modalità è stata elaborata correttamente, false altrimenti.
 */
exports.changeVideoMode = (toOriginal) => {
    if(toOriginal)
        return model.setOriginalMode();
    else
        return model.setPreviewMode();
};

/**
 * Notifica il gradimento del contenuto della tabella
 * @returns {boolean} true se la richiesta di conferma è stata elaborata correttamente, false altrimenti.
 */
exports.confirmEditing = () => {
    return model.sendConfirmation();
}
