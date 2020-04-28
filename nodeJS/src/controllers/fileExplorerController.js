// fileExplorerController module
// requires model and view
let view=require('../views/fileExplorerView');
//model= require('../models/fileExplorerModel');
exports.getBody = (req,res) => {
    view.print(req,res);
}
