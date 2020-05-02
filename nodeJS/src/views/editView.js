/**
 * File Explorer View module.
 * @module views/fileExplorerView
 */

//require the template
//const body= require('../templates/editTemplate.hbs');
exports.print = (res) => {
    res.render('layouts/editTemplate');
};

/**
 * Renderizza un video frame che permette di riprodurre il video indicato dall’url nella modalità indicata
 * da isOriginal sfruttando il videoTemplate
 * @param {string} url - rappresenta l'URL pubblico del video da riprodurre
 * @param {boolean} isOriginal - indica il tipo di video in riproduzione
 * @param {object} res - Rappresenta la risposta XHTML
 */
exports.generateVideoFrame = (url, isOriginal, res)=>{
    res.render('partials/videoFrame',
        {
            url: url,
            isOriginal: isOriginal,
            layout: false
        });
};