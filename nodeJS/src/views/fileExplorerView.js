// fileExplorerView module

//require the template
//const body= require('../templates/fileExplorerTemplate.hbs');
const hbs = require('hbs');
const fs = require('fs');
const path = require('path');

/**
 * Effettua il rendering del body della pagina di visualizzazione dei file in base ai parametri contenuti nel json fileList. Se fileList
 * contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 * @param {json} fileList - Lista dei file in formato json contente la key del file e l'url alla sua thumbail
 */
exports.print = (req,res,fileList) => {
    //Scorro tutti i file nel json e costruisco le singole tiles
    let tiles = fileList.files.map((singleFile) => {
        return createTile(singleFile.fileKey,singleFile.thumbnailUrl);
    });
    //Se la dimensione della variabile tiles è 0 vuol dire che non ci sono file da visualizzare
    let htmlTiles = tiles.length ? tiles.join('\n') : "<p>Non sono presenti video.</p>"
    res.render('fileExplorerTemplate',{ tiles : htmlTiles});
};

/**
 * Crea un tile che contiene le informazioni di un video (titolo, immagine e bottini elabora/scarica)
 * @param {string} fileKey - Nome del file
 * @param {string} thumbnailUrl - Url all'immagine di thumbnail del video
 * @returns {string} tile - Html della tile popolata con i parametri dati
 */
function createTile(fileKey, thumbnailUrl) {
    //Carico il template della singola tile e lo compilo con i dati
    const tileTemplate = fs.readFileSync(path.join(__dirname, 'tileTemplate.hbs'), 'utf8');
    const template = hbs.compile(tileTemplate);
    return template({fileKey: fileKey, thumbnailUrl: thumbnailUrl});
}