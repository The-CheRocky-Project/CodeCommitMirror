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

/**
 * All'accesso all'API getTable() la function restituisce l’oggetto XHTML
 * rappresentante la tabella delle label aggiornata tramite la
 * updateLabelTable() dell’editController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('getTable', (req,res) => {
    editController.updateLabelTable(res);
});

/**
 * All'accesso all'API selectFile(fileKey) la function  ​richiede al File Explorer Controller
 * di effettuare la scelta del file in base alla filekey ricevuta in POST in formato json.
 * @param {object} req - Rappresenta la richiesta http contenente la fileKey
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('selectFile', (req,res) => {
    res.send(fileExplorerController.launchFileProcessing(req.body['fileKey']));
});

/**
 *  ​Notifica il client tramite il socket che una riga
 *  della tabella dei riconoscimenti è stata cambiata.
 * @param {object} req - Rappresenta la richiesta http contenente la fileKey
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('notifyLabelRowChange', (req,res) => {
    res.send(backport.emit('changedRow',req.body['rowIndex']));
});

/**
 *  Seleziona la label indicata tramite HTTP POST come
 *  parametro sfruttando la funzione checkLabel(labelIndex)
 *  dell’editController.
 * @param {object} req - Rappresenta la richiesta http contenente la labelIndex
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('includeLabel', (req,res) => {
    res.send(fileExplorerController.checkLabel(req.body['rowIndex']));
});

/**
 *  Deseleziona la label indicata tramite HTTP POST come
 *  parametro sfruttando la funzione uncheckLabel(labelIndex)
 *  dell’editController.
 * @param {object} req - Rappresenta la richiesta http contenente la labelIndex
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('includeLabel', (req,res) => {
    res.send(fileExplorerController.uncheckLabel(req.body['rowIndex']));
});

/**
 * All'accesso all'API getVideoFrame() la function restituisce l’oggetto XHTML
 * rappresentante il frame video aggiornato tramite la funzione
 * updateVideoFrame() dell’editController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('getVideoFrame', (req,res) => {
    editController.updateVideoFrame(res);
});

/**
 *  ​API che si occupa dell’inoltro delle informazioni delle label passate tramite HTTP POST
 *  come parametro sfruttando la funzione addNewLabelRow(start, duration, modelIndex).
 * @param {object} req - Rappresenta la richiesta http contenente il dizionario con start, duration e model index
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('addLabel', (req,res) => {
    const reqDict=req.body;
    res.send(editController.addNewLabelRow(reqDict['start'],reqDict['duration'],reqDict['modelIndex']));
});

/**
 *  ​API che si occupa della notifica dell'intenzione da parte dell'utente di voler
 *  cambiare la modalità di visualizzazione del video in base al parametro toOriginal
 * @param {object} req - Rappresenta la richiesta http contenente il valore booleano toOriginal
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('setVideoMode', (req,res) => {
    res.send(editController.changeVideoMode(req.body['toOriginal']));
});

/**
 *  ​API che si occupa della notifica del client tramite il socket
 *  che il processo di montaggio è stato concluso correttamente o negativamente.
 * @param {object} req - Rappresenta la richiesta http contenente il booleano done
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('notifyEditingFinish', (req,res) => {
    res.send(backport.emit('finish', req.body['done']));
});

/**
 *  ​API che si occupa della notifica del client tramite il socket
 *  che la lista dei files è cambiata.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('notifyChangedFileList', (req,res) => {
    res.send(backport.emit('changeFile',''));
});

/**
 *  ​API che si occupa dell'inoltro della richiesta di conferma
 *  del gradimento dello stato attuale della tabella dei riconoscimenti
 *  tramite la funzione confirmEditing() dell’editController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('confirmEdit', (req,res) => {
    res.send(editController.confirmEditing());
});

/**
 * All'accesso all'API getProgressionBar() la function restituisce l’oggetto XHTML
 * rappresentante la  la progress bar aggiornata tramite la
 * funzione getUpdatedBar() del loadingController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('getProgressionBar', (req,res) => {
    loadingController.getUpdatedBar(res);
});

/**
 *  ​API che si occupa della ​notifica del client tramite il socket
 *  che il livello di progressione è cambiato ricevendo in
 *  POST il valore percentuale.
 * @param {object} req - Rappresenta la richiesta http contenente il valore intero progress
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('notifyProgressionUpdate', (req,res) => {
    res.send(backport.emit('progress',req.body['progress']));
    if (progression >= 100)
        activePage = pages.edit;
});