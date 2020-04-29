// loadingView module
//const handlebars = require('handlebars');
//Register progressBar as a partial
//handlebars.registerPartial('progressBar','progressBar');
/**
 * Effettua il rendering del body della pagina di caricamento
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
exports.print = (req,res) => {
    res.render('layouts/loadingTemplate',
        {
            template: 'progressBar',
            data:{
                progression: 0
            }
        });
};
