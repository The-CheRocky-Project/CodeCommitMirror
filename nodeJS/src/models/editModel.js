/**
 * Edit Model module
 * @module models/editModel
 */
const s3Wrap = require('../wrappers/s3Wrapper');
const snsWrap = require('../wrappers/snsWrapper');
const aws = require("aws-sdk");

// //sets up environment variables
const AWSregion = "us-east-2";
const userCode = "693949087897";
const cleanMachineArn="arn:aws:states:us-east-2:693949087897:stateMachine:clean";

//Rappresenta lo stato attuale del video in fase di lavorazione
let actualVideoKey = {
    partialKey: "",
    original: true
};

//Prefissi di default per la chiave video
const originalPrefixes = {
    true: "origin/",
    false: "modify/"
};

//Bucket e region di default
const s3Defaults ={
    bucket: "ahlconsolebucket",
    region: "us-east-2"
}

//TODO manca getVideoType(), bisogna aggiungerlo e bisogna anche fare relativi test di unità

/**
 * Effettua la comunicazione di impostare il video in modalità preview.
 * @returns {string} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.getVideoEndpoint =  () =>{
    let key = originalPrefixes[actualVideoKey.original] + actualVideoKey.partialKey;
    if(!actualVideoKey.original){
        const split = key.split('.');
        let destinationKey = s3Defaults[actualVideoKey.original];
        for( let section in split){
            destinationKey = destinationKey + section + ".";
            if(section == split[split.length-2])
                destinationKey= destinationKey + "-edit.";
        }
        key = destinationKey.replace("-edit.mp4.","-edit.mp4");
    }
    return s3Wrap.getObjectUrl(
        key,
        s3Defaults.bucket,
        s3Defaults.region);
};

/** TODO fix doc description
 * Effettua la richiesta di selezione della riga di indice index al sistema.
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente.
 * @param {number} index - Rappresenta l'indice della riga da selezionare
 */
exports.getRecognizementList = async () =>{
    return s3Wrap.getJsonFile(s3Defaults.bucket, "tmp/modified-resume.json");
};

/**
 * Effettua la comunicazione di impostare il video in modalità preview.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setPreviewMode = () =>{
    actualVideoKey.original = false;
    return !actualVideoKey.original;
};

/**
 * Effettua la comunicazione di impostare il video in modalità originale.
 * @returns {boolean} true se la chiamata è stata effettuata con successo, false altrimenti.
 */
exports.setOriginalMode =() =>{
    actualVideoKey.original = true;
    return actualVideoKey.original;
};

/**
 * Effettua il recupero del file contenente le labels tramite l's3Wrapper.
 * @returns {object} dizionario Json contenente le label impostate secondo le cartelle del modello.
 */
exports.getmodelLabels = async () =>{
    return s3Wrap.getJsonFile(s3Defaults.bucket, "labelList.json");
};


/**
 * Effettua la richiesta di aggiunta di una riga al sistema secondo i parametri specificati dal dizionario json params.
 * @param {number} modelIndex - Rappresenta il dizionario Kson contenente tutte le specifiche della riga da inserire
 */
exports.addRow = async (params) =>{
    const data = {
        start: params['start'],
        duration: params['duration'],
        label: params['label']
    };
    let topicPub=new snsWrap.TopicPublisher("editLabels", AWSregion, userCode);
    return topicPub.sendMessage("addRow",data,"application/json");
};

/**
 *  Effettua la comunicazione di accettazione dell’attuale tabella dei riconoscimenti
 *  comunicando così l’intenzione di terminare il processo di editing.
 * @returns {boolean} ritorna true se la chiamata è stata effettuata correttamente, false altrimenti.
 */
exports.sendConfirmation= ()=>{
    let topicPub=new snsWrap.TopicPublisher('confirmation', AWSregion, userCode);
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
    let topicPub=new snsWrap.TopicPublisher('editLabels', AWSregion, userCode);
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
        target: index,
        check: "False"
    }
    let topicPub=new snsWrap.TopicPublisher('editLabels', AWSregion, userCode);
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
        target: index,
        check: "True"
    }
    let topicPub=new snsWrap.TopicPublisher('editLabels', AWSregion, userCode);
    return topicPub.sendMessage("checkRow",data,"application/json");
    // return await snsWrap.message({
    //     message: "checkRow",
    //     target: index
    // });
};

/**
 * Effettua la richiesta di reset della tabella dei riconoscimenti
 * @returns {Promise<Boolean>}
 */
exports.sendReset = () => {
    let topicPub = new snsWrap.TopicPublisher('editLabels',AWSregion,userCode);
    return topicPub.sendMessage('reset',{},"application/json");
}


exports.sendJobCancellation = async () => {
    const params = {
        stateMachineArn: cleanMachineArn,
        input: '{"action":"cancelJob", "key":"' +  +'"}'
    }
    let result = false;
    let stepFunctions = new aws.StepFunctions();
    await stepFunctions.startExecution(params)
        .promise()
        .then(data => result=true)
        .catch(error => console.log(error, error.message));
    return result;
}

exports.setVideoEndpoint = (videoKey) => {
    actualVideoKey.partialKey = videoKey;
}
