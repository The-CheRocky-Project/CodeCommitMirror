/**
 * File Explorer Controller module.
 * @module controllers/fileExplorerController
 */
// requires model and view
const view = require('../views/fileExplorerView');
const model = require('../models/fileExplorerModel');

/**
 * Effettua il rendering del body della pagina di visualizzazione dei file in base ai parametri contenuti
 * nel json fileList. Se fileList contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {object} res - Rappresenta la risposta XHTML
 */
exports.getBody = async (res) => {
    const mainLayout = true;
    const fileList = await retriveFileList();
    view.print({files:fileList,main:mainLayout},res);
}

/**
 * Effettua il rendering del container di visualizzazione dei tile in base ai parametri contenuti
 * nel json fileList. Se fileList contiene una lista vuota farà il rendereing di un avvertimento.
 * @param {object} res - Rappresenta la risposta XHTML
 */
exports.getUpdatedFileList = async (res) => {
    const mainLayout = false;
    const fileList = await retriveFileList();
    view.print({files:fileList,main:mainLayout},res);
};

/**
 * Funzione ausiliaria asincrona per invocare il prelievo dei dati dal fileExploereModel.
 */
async function retriveFileList(){
    const fileKeys = await model.listFileKeys();
    let fileList = Array();
    fileKeys.forEach( key => fileList.push({
        fileKey: key,
        thumbnailURL: model.getThumbnailURL(key)
    }));
    return fileList;
}

/**
 * Effettua la chiamata al model per il lancio del processo di elaborazione
 * @param {object} fileKey - Rappresenta la risposta XHTML
 */
exports.launchFileProcessing = (fileKey) => {
    return model.processFile(fileKey);
};