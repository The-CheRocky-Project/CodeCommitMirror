// fileExplorerView module

//require the template
//const body= require('../templates/fileExplorerTemplate.hbs');

/**
 * Effettua il rendering del body della pagina di visualizzazione dei file in base ai parametri contenuti nel json fileList. Se fileList
 * contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 * @param {json} fileList - Lista dei file in formato json contente la key del file e l'url alla sua thumbail
 */
exports.print = (req,res,fileList) => {
    res.render('fileExplorerTemplate',fileList);
};