/**
 * Edit Model module.
 * @module models/editModel
 */
const s3Wrap = require('../wrappers/s3Wrapper');
const snsWrap = require('../wrappers/snsWrapper');

//Rappresenta lo stato attuale del video in fase di lavorazione
let actualVideoKey = {
    partialKey: "",
    original: true
};

//Prefissi di default per la chiave video
const originalPrefixes = {
    true: "origin",
    false: "preview"
};

//Bucket e region di default
const s3Defaults ={
    bucket: "ahlconsolebucket",
    region: "us-east-2"
}


/**
 * Effettua la comunicazione di impostare il video in modalità preview.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.getVideoEndpoint =  () =>{
    return s3Wrap.getObjectUrl(
        originalPrefixes[actualVideoKey.original] + actualVideoKey.key,
        s3Defaults.bucket,
        s3Defaults.region);
};

//
// exports.getRecognizementList = () =>{
//
// };

/**
 * Effettua la comunicazione di impostare il video in modalità preview.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setPreviewMode = async () =>{
    if(await snsWrap.message({
        message: "setPreview"
    })){
        actualVideoKey.original = false;
    }
};

/**
 * Effettua la comunicazione di impostare il video in modalità originale.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setOriginalMode = async () =>{
    if(await snsWrap.message({
        message: "setOriginal"
    })){
        actualVideoKey.original = true;
    }
};

/**
 * Effettua il recupero del file contenente le labels tramite l's3Wrapper.
 * @returns {object} dizionario Json contenente le label impostate secondo le cartelle del modello.
 */
exports.getmodelLabels = async () =>{
    return await s3Wrap.getJsonFile(s3Defaults.bucket,"labels.json");
};


/**
 * Effettua la richiesta di aggiunta di una riga al sistema secondo i parametri specificati dal dizionario json params.
 * @param {number} modelIndex - Rappresenta il dizionario Kson contenente tutte le specifiche della riga da inserire
 */
exports.addRow = async (params) =>{
    return await snsWrap.message({
        target: "addRow",
        start: params['start'],
        duration: param['duration'],
        label: params['labelModelIndex']
    })
};
/**
 *  Effettua la comunicazione di accettazione dell’attuale tabella dei riconoscimenti
 *  comunicando così l’intenzione di terminare il processo di editing.
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente, false altrimenti.
 */
exports.sendConfirmation= ()=>{

    return snsWrap.message({
        message: "confirmTable"
    })
};

/**
 * Restuisce il tipo di video correntemente in esecuzione.
 * @returns {boolean} ritorna true se se il video in riproduzione è quello originale false altrimenti.
 */
    return isOriginal;
exports.getVideoType = ()=>{
};
/**
 * Effettua la richiesta di aggiornamento di una riga al sistema secondo i parametri specificati dal dizionario json params.

 * @param {object} params - Rappresenta il dizionario Json contenente tutte le specifiche della riga da aggiornare
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 */
exports.updateRow = (params)=>{
    return snsWrap.message({
        message: "updateRow",
        start: params['start'],
        index: params['index'],
        duration: param['duration'],
        label: params['labelModelIndex']
    });
};
};
    });
        target: index
        message: "uncheckRow",
    return snsWrap.message({
exports.uncheckRow = (index) =>{
 */
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 * @param {number} index - Rappresenta l'indice della riga da de-selezionare
 *  Effettua la richiesta di de-selezione della riga di indice index al sistema.
/**

};
    });
        target: index
        message: "checkRow",
    return snsWrap.message({
 */
exports.checkRow = (index) =>{
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 * @param {number} index - Rappresenta l'indice della riga da selezionare
 *  Effettua la richiesta di selezione della riga di indice index al sistema.
/**
