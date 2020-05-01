/**
 * Edit Model module.
 * @module models/editModel
 */
const s3Wrap = require('../wrappers/s3Wrapper');
const snsWrap = require('../wrappers/snsWrapper');

/**
 * parametro che memorizza il tipo del video in riproduzione
 */
let isOriginal = true;


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
    let ok = snsWrap.message({
        message: "setPreview"
    });

    if(ok)
        isOriginal = false;

    return ok;
};

/**
 * Effettua la comunicazione di impostare il video in modalità originale.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setOriginalMode = () =>{
    const ok = snsWrap.message({
        message: "setOriginal"
    });

    if(ok)
        isOriginal = true;

    return ok;
};

/**
 * Effettua il recupero del file contenente le labels tramite l's3Wrapper.
 * @returns {object} dizionario Json contenente le label impostate secondo le cartelle del modello.
 */
exports.getmodelLabels = () =>{
    return s3Wrap.getJsonFile("labels");
};


/**
 * Effettua la richiesta di aggiunta di una riga al sistema secondo i parametri specificati dal dizionario json params.
 * @param {object} params - Rappresenta il dizionario Json contenente tutte le specifiche della riga da inserire
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 */
exports.addRow = (params) =>{
    return snsWrap.message({
        message: "addRow",
        start: params['start'],
        duration: param['duration'],
        label: params['labelModelIndex']
    });
};

/**
 *  Effettua la richiesta di selezione della riga di indice index al sistema.
 * @param {number} index - Rappresenta l'indice della riga da selezionare
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 */
exports.checkRow = (index) =>{
    return snsWrap.message({
        message: "checkRow",
        target: index
    });
};

/**
 *  Effettua la richiesta di de-selezione della riga di indice index al sistema.
 * @param {number} index - Rappresenta l'indice della riga da de-selezionare
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 */
exports.uncheckRow = (index) =>{
    return snsWrap.message({
        message: "uncheckRow",
        target: index
    });
};

/**
 * Effettua la richiesta di aggiornamento di una riga al sistema secondo i parametri specificati dal dizionario json params.
 * @param {object} params - Rappresenta il dizionario Json contenente tutte le specifiche della riga da aggiornare
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 */
exports.updateRow = (params)=>{
    return snsWrap.message({
        message: "updateRow",
        index: params['index'],
        start: params['start'],
        duration: param['duration'],
        label: params['labelModelIndex']
    });
};

