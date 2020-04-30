// loadingView module
//const handlebars = require('handlebars');
//Register progressBar as a partial
//handlebars.registerPartial('progressBar','progressBar');
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
