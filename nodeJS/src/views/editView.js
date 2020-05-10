/**
 * File Explorer View module.
 * @module views/fileExplorerView
 */

/**
 * Effettua il rendering del body in base ai parametri
 * @param {string} videoURL - rappresenta l'URL pubblico del video originale o modificato
 * @param {object} listParams - dizionario contenente tutti i dettagli delle varie righe per la creazione della tabella
 * @param {Object} res - Rappresenta la risposta http
 */
exports.print = (params, res) => {
    res.render('layouts/editTemplate',
        {
            template: 'editTemplate',
            data: {
                videoData: {
                    endpoint: params.url,
                    original: params.originalVideo
                },
                tableData:{
                    error: params.error,
                    recognizements: params.list,
                    labelIndexes: params.labels
                },
            },
            layout: true
        });
    // generateVideoFrame(videoURL, true, res);
    // generateTable(listParams, res);
};

/**
 * Renderizza un video frame che permette di riprodurre il video indicato dall’url nella modalità indicata
 * da isOriginal sfruttando il videoTemplate
 * @param {string} url - rappresenta l'URL pubblico del video da riprodurre
 * @param {boolean} isOriginal - indica il tipo di video in riproduzione
 * @param {object} res - Rappresenta la risposta XHTML
 */
//TODO sostituire params con i valori corretti (i parametri della funzione?)
exports.generateVideoFrame = (url, isOriginal, res)=>{
    res.render('partials/videoFrame',
        {
            endpoint: params.url,
            original: params.originalVideo,
            layout: false
        });
};

/**
 * Renderizza una tabella composta dalle righe indicate dal parametro
 * @param {object} params - dizionario Json che contiene tutti di dettagli di tutte le righe
 * @param {object} res - Rappresenta la risposta XHTML
 */
exports.generateTable = (params, res)=>{
    res.render('partials/tableTemplate',{
        data:{
            errorData:{
                error: params.error
            },
            rowData: {
                recognizement: params.list,
                labelIndexes: params.labels
            }
        },
        layout: false
    });
};