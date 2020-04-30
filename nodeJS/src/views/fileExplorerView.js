/**
 * File Explorer View module.
 * @module views/fileExplorerView
 */


/**
 * Effettua il rendering del body della pagina di visualizzazione dei file in base ai parametri contenuti nel json fileList. Se fileList
 * contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {object} param - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 * @param {json} fileList - Lista dei file in formato json contente la key del file e l'url alla sua thumbail
 */
exports.print = (param,res) => {
    res.render('layouts/fileExplorerTemplate', {
        template: 'fileExplorerTemplate',
        data: param['files'],
        layout: param['main']?"main":false
    });
};