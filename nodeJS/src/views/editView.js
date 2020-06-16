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
    for(let i =0; i<params.list.length; i++){
        params.list[i]['labelList'] = params.labels.labels;
    }
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
                    labels:params.labels.labels
                },
            },
            layout: "main"
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
  //TODO eliminato il parametro => endpoint: params.url, original: params.originalVideo,
    res.render('layouts/videoLayout',
        {
            template: 'videoLayout',
            layout: 'videoLayout',
            data: {
                endpoint: url,
                original: isOriginal,
            }
        });
};

/**
 * Renderizza una tabella composta dalle righe indicate dal parametro
 * @param {object} params - dizionario Json che contiene tutti di dettagli di tutte le righe
 * @param {object} res - Rappresenta la risposta XHTML
 */
exports.generateTable = (params, res)=>{
    for(let i =0; i<params.list.length; i++){
        params.list[i]['labelList'] = params.labels.labels;
    }
    res.render('layouts/tableLayout',{
        template:'tableLayout',
        data:{
            error: params.error,
            recognizements: params.list,
            labels:params.labels.labels
        },
        layout: "tableLayout"
    });
};
