/**
 * Loading Controller module.
 * @module controllers/loadingController
 */
// requires model and view
const view = require('../views/loadingView');

/**
 * Funzione per ​stampare la progress bar iniziale
 * @param {object} res - Rappresenta un oggetto XHTML da ritornare
 */
exports.getBody = (res) => {
    view.print(res)
}