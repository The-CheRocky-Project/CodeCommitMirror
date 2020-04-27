// editController module
// requires model and view
let view=require('../views/editView');
//model= require('../models/editModel');
exports.getBody = (req,res) => {
    view.print(req,res);
}
