/**
 * File Explorer View module.
 * @module views/fileExplorerView
 */


/**
 * Effettua il rendering del body della pagina di visualizzazione dei file in base ai parametri contenuti nel json fileList. Se fileList
 * contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {Dict} param - Rappresenta il dizionario di parametri con cui comporre la view:
 *          Lista dei file in formato json contente la key del file e l'url alla sua thumbail
 *          data: Booleano per il layout principale
 * @param {XHTMLresponse} res - Rappresenta la risposta http
 */
exports.print = (param,res) => {
    res.render('layouts/fileExplorerTemplate', {
        template: 'fileExplorerTemplate',
        data: param,
        layout: param['main']?"main":false
    });
};