/**
 * Edit Model module
 * @module models/editModel
 */
const s3Wrap = require('../wrappers/s3Wrapper');
const snsWrap = require('../wrappers/snsWrapper');

// //sets up environment variables
const AWSregion = "us-east-2";
const userCode = "693949087897";

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

//TODO manca getVideoType(), bisogna aggiungerlo e bisogna anche fare relativi test di unità

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

/**
 * Effettua la richiesta di selezione della riga di indice index al sistema.
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 * @param {number} index - Rappresenta l'indice della riga da selezionare
 */
exports.getRecognizementList = async () =>{
    return await s3Wrap.getJsonFile(s3Defaults.bucket,"resume.json");
};

/**
 * Effettua la comunicazione di impostare il video in modalità preview.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setPreviewMode = async () =>{
    let topicPub=new snsWrap.TopicPublisher("videoModeTopic", AWSregion, userCode);
    let result = topicPub.sendMessage("setPreview","","");
    if(result){
        actualVideoKey.original = false;
    }
    return result;
    // if(await snsWrap.message({
    //     message: "setPreview"
    // })){
    //     actualVideoKey.original = false;
    // }
};

/**
 * Effettua la comunicazione di impostare il video in modalità originale.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setOriginalMode = async () =>{
    let topicPub=new snsWrap.TopicPublisher("videoModeTopic", AWSregion, userCode);
    let result = topicPub.sendMessage("setOriginal","","");
    if(result){
        actualVideoKey.original = true;
    }
    return result;
    // if(await snsWrap.message({
    //     message: "setOriginal"
    // })){
    //     actualVideoKey.original = true;
    // }
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
    let data = {
        start: params['start'],
        duration: params['duration'],
        label: params['labelModelIndex']
    }
    let topicPub=new snsWrap.TopicPublisher("videoSuggestionTopic", AWSregion, userCode);
    return topicPub.sendMessage("addRow",data,"application/json");
    // return await snsWrap.message({
    //     target: "addRow",
    //     start: params['start'],
    //     duration: params['duration'],
    //     label: params['labelModelIndex']
    // })
};

/**
 *  Effettua la comunicazione di accettazione dell’attuale tabella dei riconoscimenti
 *  comunicando così l’intenzione di terminare il processo di editing.
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente, false altrimenti.
 */
exports.sendConfirmation= ()=>{
    let topicPub=new snsWrap.TopicPublisher('videoSuggestionTopic', AWSregion, userCode);
    return topicPub.sendMessage("confirmTable","","");
    // return snsWrap.message({
    //     message: "confirmTable"
    // })
};

/**
 * Restuisce il tipo di video correntemente in esecuzione.
 * @returns {boolean} ritorna true se se il video in riproduzione è quello originale false altrimenti.
 */
exports.isVideoTypeOriginal = ()=>{
    return actualVideoKey.original;
};

/**
 * Effettua la richiesta di aggiornamento di una riga al sistema secondo i parametri specificati dal dizionario json params.
 * @param {object} params - Rappresenta il dizionario Json contenente tutte le specifiche della riga da aggiornare
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 */
exports.updateRow = async (params)=>{
    let data = {
        start: params.start,
        index: params.index,
        duration: params.duration,
        label: params.labelModelIndex
    }
    let topicPub=new snsWrap.TopicPublisher('videoSuggestionTopic', AWSregion, userCode);
    return topicPub.sendMessage("updateRow",data,"application/json");

    // return await snsWrap.message({
    //     message: "updateRow",
    //     start: params.start,
    //     index: params.index,
    //     duration: params.duration,
    //     label: params.labelModelIndex
    // });
};

/**
 * *  Effettua la richiesta di de-selezione della riga di indice index al sistema.
 * @returns {Generator<*, void, *>}
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 * @param {number} index - Rappresenta l'indice della riga da de-selezionare
 */
exports.uncheckRow = async (index) =>{
    let data = {
        target: index
    }
    let topicPub=new snsWrap.TopicPublisher('videoSuggestionTopic', AWSregion, userCode);
    return topicPub.sendMessage("uncheckRow",data,"application/json");
    // return await snsWrap.message({
    //     message: "uncheckRow",
    //     target: index
    // });
};

/**
 * Effettua la richiesta di selezione della riga di indice index al sistema.
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 * @param {number} index - Rappresenta l'indice della riga da selezionare
 */
exports.checkRow = async (index) =>{
    let data = {
        target: index
    }
    let topicPub=new snsWrap.TopicPublisher('videoSuggestionTopic', AWSregion, userCode);
    return topicPub.sendMessage("checkRow",data,"application/json");
    // return await snsWrap.message({
    //     message: "checkRow",
    //     target: index
    // });
};
