// fileExplorerController module
// requires model and view
const view = require('../views/fileExplorerView');
const model = require('../models/fileExplorerModel');

/**
 * Effettua il rendering del body della pagina di visualizzazione dei file in base ai parametri contenuti nel json fileList. Se fileList
 * contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {object} res - Rappresenta la risposta XHTML
 */
exports.getBody = (res) => {
    const mainLayout = true;
    const fileList = getUpdatedFileList();
    view.print({files:fileList,main:mainLayout},res);
}

exports.getUpdatedFileList = () => {
    //Variabile fileList di prova (da costruire prendendo i file da s3)
    const fileKeys = model.listFileKeys();
    let fileList = Array();
    for (key in fileKeys){
        fileList.push({
            fileKey: key,
            thumbnailURL: model.getThumbnailURL(key)
        });
    }
    return fileList;
};

/**
 * Effettua la chiamata al model per il lancio del processo di elaborazione
 * @param {object} fileKey - Rappresenta la risposta XHTML
 */
exports.launchFileProcessing = (fileKey) => {
    return model.processFile(fileKey);
};