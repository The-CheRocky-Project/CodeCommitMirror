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
    //Scorro tutti i file nel json e costruisco le singole tiles
    let tiles = fileList.files.map(function(singleFile){
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
    return [
        '<div class="col-md-4">',
            '<div class="card mb-4 shadow-sm">',
                '<img src="' + thumbnailUrl + '" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail" title="Descrizione immagine"></img>',
                //Versione con placeholder per la thumbnail invece che usare l'url
                //'<svg class="bd-placeholder-img card-img-top" width="100%" height="225" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" focusable="false" role="img" aria-label="Placeholder: Thumbnail"><title>Placeholder</title><rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef" dy=".3em">Thumbnail</text></svg>',
                '<div class="card-body">',
                    '<p>' + fileKey + '</p>',
                    '<div class="d-flex justify-content-between align-items-center">',
                        '<div class="btn-group">',
                            '<button type="button" class="btn btn-sm btn-outline-secondary">Scarica</button>',
                            '<button type="button" class="btn btn-sm btn-outline-secondary">Elabora</button>',
                        '</div>',
                    '</div>',
                '</div>',
            '</div>',
        '</div>'
    ].join('\n');
}