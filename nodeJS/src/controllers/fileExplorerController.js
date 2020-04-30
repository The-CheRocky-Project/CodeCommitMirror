// fileExplorerController module
// requires model and view
let view = require('../views/fileExplorerView');
let model = require('../models/fileExplorerModel');

/**
 * Effettua il rendering del body della pagina di visualizzazione dei file in base ai parametri contenuti nel json fileList. Se fileList
 * contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {object} res - Rappresenta la risposta http
 */
exports.getBody = (res) => {
    //Variabile fileList di prova (da costruire prendendo i file da s3)
    const fileKeys = fileExplorerModel.getUpdateFileList();
    let fileList = Array();
    for (key in fileKeys){
        fileList.push({
            fileKey: key,
            thumbnailURL: fileExplorerModel.getThumbnailURL(key)
        });
    }
    view.print(fileList,res);
}
