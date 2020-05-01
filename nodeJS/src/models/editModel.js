/**
 * Edit Model module.
 * @module models/editModel
 */
const s3Wrap = require('../wrappers/s3Wrapper');
const snsWrap = require('../wrappers/snsWrapper');


// exports.getVideoEndpoint = () =>{
//     return const videoURL = s3Wrap.getObjectUrl(fileKey);
// };
//
// exports.getRecognizementList = () =>{
//
// };

/**
 * Effettua la comunicazione di impostare il video in modalità preview.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setPreviewMode = () =>{
    return snsWrap.message({
        message: "setPreview"
    })
};

/**
 * Effettua la comunicazione di impostare il video in modalità originale.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setOriginalMode = () =>{
    return snsWrap.message({
        message: "setOriginal"
    })
};


/**
 * Effettua il recupero del file contenente le labels tramite l's3Wrapper.
 * @returns {object} dizionario Json contenente le label impostate secondo le cartelle del modello.
 */
exports.getmodelLabels = () =>{
    return s3Wrap.getJsonFile("labels");
};