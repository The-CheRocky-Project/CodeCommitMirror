/**
 * Loading Controller module.
 * @module controllers/loadingController
 */
// requires model and view
let view=require('../views/loadingView');
model= require('../models/loadingModel');

exports.getBody = (req,res) => {
    view.print(req,res);
}
