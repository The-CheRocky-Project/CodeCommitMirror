/**
 * Loading View module.
 * @module views/loadingController
 */

/**
 * Effettua il rendering del body della pagina di caricamento allo stato iniziale
 * @param {object} res - Rappresenta la risposta http
 */
exports.print = (res) => {
    res.render('layouts/loadingTemplate',
        {
            template: 'progressBar',
            data:{
                progression: 0
            }
        });
};

/**
 * Effettua il rendering della progress bar nella percentuale indicata dalla request
 * @param {object} res - Rappresenta la risposta XHTML
 * @param {integer} percent - Rappresenta il livello di progressione che si vuole renderizzare
 */
exports.generateProgressBar = (res,percent) => {
    res.render('partials/progressBar',
        {
            progression: progress,
            layout: false
        });
};