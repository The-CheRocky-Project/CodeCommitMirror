// fileExplorerController module
// requires model and view
let view=require('../views/fileExplorerView');
//model= require('../models/fileExplorerModel');
exports.getBody = (req,res) => {
    //Variabile fileList di prova (da costruire prendendo i file da s3)
    fileList = { files:[{fileKey: 'titoloProva',thumbnailUrl: 'urlThumbnail'},{fileKey: 'PartitaDiCalcio',thumbnailUrl: 'urlImmagine'}] };
    view.print(req,res,fileList);
}
