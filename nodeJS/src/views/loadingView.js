// loadingView module
//const handlebars = require('handlebars');
//Register progressBar as a partial
//handlebars.registerPartial('progressBar','progressBar');
exports.print = (req,res) => {
    res.render('loadingTemplate',
        {
            progressBarData:{
                progression: 0
            },
            layout: false
        });
};
