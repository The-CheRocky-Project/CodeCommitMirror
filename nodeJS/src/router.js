/**
 * Router module - Main Application.
 * @module router
 */
// requires all the modules dependencies
const express = require('express');
const ahl = express();
const http = require('http').createServer(ahl);
const port = process.env.PORT || 3000;
const path = require('path');
const exphbs = require('express-handlebars');


//creates a backport for the socket communication
const backport = require('socket.io')(http);

//publish CSS, client JS and images
ahl.use(express.static(path.join(__dirname,'/public')));

//refers different paths for every component
ahl.set('controllers',path.join(__dirname,'controllers'));
ahl.set('models',path.join(__dirname,'models'));
ahl.set('views',path.join(__dirname,'views'));


// sets up the handlebars view engine
const partialsLocation = path.join(__dirname,'views/partials');
const layoutsLocation = path.join(__dirname,'views/layouts');
ahl.engine('.hbs', exphbs({
    extname: 'hbs',
    layoutsDir: layoutsLocation,
    partialsDir: partialsLocation,
    defaultLayout: 'main'
}));
ahl.set('view engine','.hbs');

// initialize all the 3 controller
const fileExplorerController = require('./controllers/fileExplorerController');
const loadingController = require('./controllers/loadingController');
const editController = require('./controllers/editController');

const pages = {
    fileExplorer: fileExplorerController,
    loading: loadingController,
    edit: editController
}

let activePage = pages.fileExplorer;
const getActive = () => {
    return activePage;
};

//sets up all the routes
ahl.get('/',(req,res) =>
    getActive().getBody(req,res)
);

ahl.all('/toFileExplorer',(req,res) => {
    console.log('called toFileExplorer');
    activePage = pages.fileExplorer;
    res.send('');
    backport.emit('refresh','');
});

ahl.all('/toLoading',(req,res) => {
    console.log('called toLoading');
    activePage = pages.loading;
    res.send('');
    backport.emit('refresh','');
    // setTimeout(() => {
    //     activePage = pages.edit;
    //     backport.emit('refresh','');
    // },10000)
});

ahl.all('/toEdit',(req,res) => {
    console.log('called toEdit');
    activePage = pages.edit;
    res.send('');
    backport.emit('refresh','');
});

// associate connection events to messages emit
backport.on('connection', (socket) => {
    console.log('user connected to io');
    socket.on('disconnect', () => {
        console.log('user disconnected from io');
    })
});

//puts the server listening on the correct port
http.listen(port, function(){
    console.log('listening on *:' + port);
});

// notifyChangedFileList()
ahl.get('/notifyChangedFileList', (req, res, next) => {
    backport.emit('changeFile', req.body);
    res.send('');
});

/**
 * All'accesso all'API getTable() la function restituisce l’oggetto XHTML
 * rappresentante la tabella delle label aggiornata tramite la
 * updateLabelTable() dell’editController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('getTable', (req,res) => {
    editController.updateLabelTable(req,res);
});

/**
 * All'accesso all'API selectFile(fileKey) la function  ​richiede al controller
 * di effettuare la scelta del file in base alla filekey ricevuta in POST in formato json.
 * @param {object} req - Rappresenta la richiesta http contenente la fileKey
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('selectFile', (req,res) => {
    res.send(fileExplorerController.launchFileProcessing(req['fileKey']));
});