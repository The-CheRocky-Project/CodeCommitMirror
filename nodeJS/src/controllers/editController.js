/**
 * Edit Controller module.
 * @module controllers/editController
 */
// requires model and view
const view = require('../views/editView');
const model = require('../models/editModel');

/**
 * Effettua il rendering del body della pagina di visualizzazione dei risultati dell'elaborazione.
 * @param {object} res - Rappresenta la risposta http
 */
exports.getBody = (res) => {
    const videoEndpoint = model.getVideoEndpoint();
    const recoList = model.getRecognizementList();
    const labelList = model.getmodelLabels();
    const params = {
        url: videoEndpoint,
        originalVideo: model.isVideoTypeOriginal(),
        error: calculateOvertime(recoList),
        list: recoList,
        labels: labelList
    }
    view.print(params, res);
}

/**
 * Imposta la modalità di visualizzazione su original oppure preview
 * @param {boolean} toOriginal - Indica se si vuole passare alla modalità original (true) oppure preview (false)
 * @returns {boolean} true se la richiestra di cambio modalità è stata elaborata correttamente, false altrimenti.
 */
exports.changeVideoMode = (toOriginal) => {
    if(toOriginal)
        return model.setOriginalMode();
    else
        return model.setPreviewMode();
};

/**
 * Genera e renderizza il nuovo frame video.
 * @param {object} res - Rappresenta la risposta http
 */
exports.updateVideoFrame = (res) => {
    const videoEndpoint = model.getVideoEndpoint();
    const isOriginal = model.getVideoType();
    view.generateVideoFrame(videoEndpoint, isOriginal, res);
};

/** Inserisce un nuovo riconoscimento customizzato.
 * @param {number} start -Rappresenta il minutaggio di inizio del nuovo riconoscimento
 * @param {number} duration - Rappresenta la durata del nuovo riconoscimento, a partire da start
 * @param {number} labelModelIndex - Rappresenta l'indice associato ad una label
 * @returns {boolean} true se la richiesta di inserimento del nuovo riconoscimento è andata a buon fine, false altrimenti.
 */
exports.addNewLabelRow = (start, duration, labelModelIndex) => {
    return model.addRow({start:start,duration:duration,label:labelModelIndex});
};

/**
 * Effettua la richiesta di selezionare o meno una riga di riconoscimento.
 * @param {number} index - Rappresenta il contenuto nella tabella dei riconoscimenti
 * @param {boolean} checked - Rappresenta lo stato di inclusione che si vuole impostare alla riga del record index
 * @returns {boolean} true se la richiesta è stata effettuata con successo, false altrimenti.
 */
exports.changeRowCheckBox = (index,checked) => {
    if(checked === true) {
        return model.checkRow(index);
    } else {
        return model.uncheckRow(index);
    }
};

/**
 * Effettua la richiesta al sistema di modificare una riga della tabella dei riconoscimenti.
 * @param {number} index - Rappresenta il contenuto nella tabella dei riconoscimenti
 * @param {number} start -Rappresenta il minutaggio di inizio del nuovo riconoscimento
 * @param {number} duration - Rappresenta la durata del nuovo riconoscimento, a partire da start
 * @param {number} modelIndex - Rappresenta l'indice associato ad una label
 * @returns {boolean} true se la richiesta è stata effettuata con successo, false altrimenti.
 */
exports.changeRowValue = (index,start, duration, modelIndex) => {
    return model.updateRow({index:index,start:start,duration:duration,labelModelIndex:modelIndex});
};

/**
 * Aggiorna il rendering della tabella dei riconoscimenti.
 * @param {object} res - Rappresenta la risposta http
 */
exports.updateLabelTable = (res) => {
    const rekoList = model.getRecongnizementList();
    view.generateTable(rekoList, res);
};

/**
 * Notifica l’accettazione del contenuto della tabella al sistema.
 * @returns {boolean} true se la richiesta di conferma è stata elaborata correttamente, false altrimenti.
 */
exports.confirmEditing = () => {
    return model.sendConfirmation();
};

/**
 * Calcola la durata totale dei riconoscimenti presenti in lista e verifica se è minore o maggiore di 5 minuti
 * @param recognizerList - la lista dei riconoscimenti
 * @returns {boolean} true se la lista di riconoscimenti supera i 5 minuti false altrimenti
 */
function calculateOvertime(recognizerList){
    let sum=0;
    for(const single in recognizerList)
        sum+=single.duration;
    return sum>300000
}