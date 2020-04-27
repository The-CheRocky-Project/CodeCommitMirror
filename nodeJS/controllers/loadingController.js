// loadingController module
// requires model and view
let view=require('../views/loadingView');
//model= require('../models/loadingModel');
exports.getBody = (req,res) => {
    view.print(req,res);
}
