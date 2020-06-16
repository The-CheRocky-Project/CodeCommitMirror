/**
 * Router module - Main Application.
 * @module router
 */
// requires all the modules dependencies
const express = require('express');
const ahl = express();
const http = require('http');
const server = http.createServer(ahl);
const port = process.env.PORT || 3000;
const path = require('path');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const sns = require('./wrappers/snsWrapper');
const AWS = require('aws-sdk');

//TODO Add dynamic enpoint over cloudformation environment variables
const endpointName = "http://ahlapp.eba-6iceedzt.us-east-2.elasticbeanstalk.com/";
//AWS configuration
AWS.config.update({region: 'us-east-2'});
process.env.AWS_REGION = "us-east-2";
const SNS = new AWS.SNS({apiVersion: '2010-03-31'});

// parse application/x-www-form-urlencoded
ahl.use(function(req, res, next) {
    if (req.get('x-amz-sns-message-type')) {
        req.headers['content-type'] = 'application/json';
    }
    next();
});
ahl.use(bodyParser.urlencoded({ extended: true }));

// parse application/json
ahl.use(bodyParser.json());

//creates a backport for the socket communication
const backport = require('socket.io')(server);

//publish CSS, client JS and images
ahl.use(express.static(path.join(__dirname,'/public')));

//refers different paths for every component
ahl.set('controllers',path.join(__dirname,'controllers'));
ahl.set('models',path.join(__dirname,'models'));
ahl.set('views',path.join(__dirname,'views'));

//TODO remove this function
ahl.all('/printHostname', (req,res) => {
    res.send(req.headers.host);
});

// sets up the handlebars view engine
const partialsLocation = path.join(__dirname,'views/partials');
const layoutsLocation = path.join(__dirname,'views/layouts');
ahl.engine('.hbs', exphbs({
    extname: 'hbs',
    layoutsDir: layoutsLocation,
    partialsDir: partialsLocation,
    defaultLayout: 'main',
    helpers: {
        eq: (op1, op2, opt) => {
            if(op1 == op2)
                return opt.fn(this);
            return opt.inverse(this);
        },
        neq: (op1, op2, opt) => {
            if(op1 != op2)
                return opt.fn(this);
            return opt.inverse(this);
        },
        perc: (subject) => {
            return parseFloat(subject).toFixed(3);
        }
    }
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
ahl.get('/',(req,res) =>{
    console.log("Requested /")
    getActive().getBody(res);
});

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
server.listen(port, function(){
    console.log('listening on *:' + port);
});

/**
 * All'accesso all'API getTable() la function restituisce l’oggetto XHTML
 * rappresentante la tabella delle label aggiornata tramite la
 * updateLabelTable() dell’editController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/getTable', (req,res) => {
  // TODO sistemare la funzione (res.send()?)
    editController.updateLabelTable(res);
});

/**
 * All'accesso all'API selectFile(fileKey) la function  ​richiede al File Explorer Controller
 * di effettuare la scelta del file in base alla filekey ricevuta in POST in formato json.
 * @param {object} req - Rappresenta la richiesta http contenente la fileKey
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/selectFile', (req,res) => {
    res.send(fileExplorerController.launchFileProcessing(req.body['fileKey']));
});

/**
 *  ​Notifica il client tramite il socket che una riga
 *  della tabella dei riconoscimenti è stata cambiata.
 * @param {object} req - Rappresenta la richiesta http contenente la fileKey
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/notifyLabelRowChange', (req,res) => {
    if(req.body.Type == "SubscriptionConfirmation"){
        if(sns.confirmTopic(req.body.TopicArn, req.body.Token)){
            console.log("Confirmed subscription " + req.body.TopicArn);
            res.sendStatus(200);
        }
        else
            res.sendStatus(422);
    }
    else{
        if(req.body.Type == "Notification" && req.body.Message == "update"){
            backport.emit('changedRow','');
            res.sendStatus(200);
        }
        else
            res.sendStatus(418);
    }
});

let labelsPromise = SNS.subscribe({
    Protocol: 'http',
    TopicArn: sns.getTopicArn('editLabels',AWS.config.region,"693949087897"),
    Endpoint: endpointName + "notifyLabelRowChange"
}).promise();
labelsPromise.then( data => console.log("Requested subscription ",data)).catch(err => console.log(
    "Subscription Error " + err,err.stack));

/**
 *  Seleziona la label indicata tramite HTTP POST come
 *  parametro sfruttando la funzione checkLabel(labelIndex)
 *  dell’editController.
 * @param {object} req - Rappresenta la richiesta http contenente la labelIndex
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/includeLabel', (req,res) => {
    res.send(editController.changeRowCheckBox(req.body['index'], true));
});

/**
 *  Deseleziona la label indicata tramite HTTP POST come
 *  parametro sfruttando la funzione uncheckLabel(labelIndex)
 *  dell’editController.
 * @param {object} req - Rappresenta la richiesta http contenente la labelIndex
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/excludeLabel', (req,res) => {
    res.send(editController.changeRowCheckBox(req.body['index'], false));
});

/**
 * All'accesso all'API getVideoFrame() la function restituisce l’oggetto XHTML
 * rappresentante il frame video aggiornato tramite la funzione
 * updateVideoFrame() dell’editController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/getVideoFrame', (req,res) => {
  // TODO sistemare la funzione (res.send()?)
    editController.updateVideoFrame(res);
});

/**
 *  ​API che si occupa dell’inoltro delle informazioni delle label passate tramite HTTP POST
 *  come parametro sfruttando la funzione addNewLabelRow(start, duration, modelIndex).
 * @param {object} req - Rappresenta la richiesta http contenente il dizionario con start, duration e model index
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/addLabel', (req,res) => {
    const reqDict=req.body;
    res.send(editController.addNewLabelRow(reqDict['start'],reqDict['duration'],reqDict['modelIndex']));
});

/**
 *  ​API che si occupa della notifica dell'intenzione da parte dell'utente di voler
 *  cambiare la modalità di visualizzazione del video in base al parametro toOriginal
 * @param {object} req - Rappresenta la richiesta http contenente il valore booleano toOriginal
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/setVideoMode', (req,res) => {
    res.send(editController.changeVideoMode(req.body['toOriginal']));
});

/**
 *  ​API che si occupa della notifica del client tramite il socket
 *  che il processo di montaggio è stato concluso correttamente o negativamente.
 * @param {object} req - Rappresenta la richiesta http contenente il booleano done
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/notifyEditingFinish', (req,res) => {
    if(req.body.Type == "SubscriptionConfirmation"){
        if(sns.confirmTopic(req.body.TopicArn, req.body.Token)){
            console.log("Confirmed subscription " + req.body.TopicArn);
            res.sendStatus(200);
        }
        else
            res.sendStatus(422);
    }
    else{
        if(req.body.Type == "Notification" && req.body.Message == "finish"){
            activePage = pages.fileExplorer;
            backport.emit('finish');
            res.sendStatus(200);
        }
        else
            res.sendStatus(418);
    }
});

let finishPromise = SNS.subscribe({
    Protocol: 'http',
    TopicArn: sns.getTopicArn('confirmation',AWS.config.region,"693949087897"),
    Endpoint: endpointName + "notifyEditingFinish"
}).promise();
finishPromise.then( data => console.log("Requested subscription ",data)).catch(err => console.log(
    "Subscription Error " + err,err.stack));

/**
 *  ​API che si occupa della notifica del client tramite il socket
 *  che la lista dei files è cambiata.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/notifyChangedFileList', (req,res) => {
    if(req.body.Type == "SubscriptionConfirmation"){
        if(sns.confirmTopic(req.body.TopicArn, req.body.Token)){
            console.log("Confirmed subscription " + req.body.TopicArn);
            res.sendStatus(200);
        }
        else
            res.sendStatus(422);
    }
    else{
        if(req.body.Type == "Notification"){
            backport.emit('changeFile','');
            res.sendStatus(200);
        }
        else
            res.sendStatus(418);
    }
});

//creates the subscription
let fileNotifyPromise = SNS.subscribe({
        Protocol: 'http',
        TopicArn: sns.getTopicArn('files',AWS.config.region,"693949087897"),
        Endpoint: endpointName + "notifyChangedFileList"
    }).promise();
fileNotifyPromise.then( data => console.log("Requested subscription ",data)).catch(err => console.log(
    "Subscription Error " + err,err.stack));

/**
 *  ​API che si occupa dell'inoltro della richiesta di conferma
 *  del gradimento dello stato attuale della tabella dei riconoscimenti
 *  tramite la funzione confirmEditing() dell’editController.
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/confirmEdit', (req,res) => {
    res.send(editController.confirmEditing());
});

// /** TODO remove from the Dev Manual
//  * All'accesso all'API getProgressionBar() la function restituisce l’oggetto XHTML
//  * rappresentante la  la progress bar aggiornata tramite la
//  * funzione getUpdatedBar() del loadingController.
//  * @param {object} req - Rappresenta la richiesta http
//  * @param {object} res - Rappresenta la risposta http
//  */
// ahl.post('getProgressionBar', (req,res) => {
//     loadingController.getUpdatedBar(res);
// });
/**
 *  ​API che si occupa della ​notifica del client tramite il socket
 *  che il livello di progressione è cambiato ricevendo in
 *  POST il valore percentuale. Nel caso la progressione sia ultimata, modifica la active page
 *  e notifica il client
 * @param {object} req - Rappresenta la richiesta http contenente il valore intero progress
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/notifyProgressionUpdate', (req,res) => {
  // TODO sistemare la funzione e testarla
    if(req.body.Type == "SubscriptionConfirmation"){
        if(sns.confirmTopic(req.body.TopicArn, req.body.Token)){
            console.log("Confirmed subscription " + req.body.TopicArn);
            res.sendStatus(200);
        }
        else
            res.sendStatus(422);
    }
    else{
        if(req.body.Type == "Notification"){
            const progr = JSON.parse(req.body.Message).progression;
            if (activePage == pages.fileExplorer) {
                activePage= pages.loading;
                backport.emit('refresh','');
            }
            backport.emit('progress',progr);
            res.sendStatus(200);
        }
        else
            res.sendStatus(418);
    }
});

//creates the subscription
let progressionPromise = SNS.subscribe({
    Protocol: 'http',
    TopicArn: sns.getTopicArn('progression',AWS.config.region,"693949087897"),
    Endpoint: endpointName + "notifyProgressionUpdate"
}).promise();
progressionPromise.then( data => console.log("Requested subscription ",data)).catch(err => console.log(
    "Subscription Error " + err,err.stack));

/**
 * All'accesso all'API getFileList() la function restituisce l’oggetto XHTML
 * rappresentante il frame contenente tutti i tiles dei video da elaborare tramite
 * la funzione getUpdatedFileList() del fileExplorerController
 * @param {object} req - Rappresenta la richiesta http
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/getFileList', (req,res) => {
  // TODO sistemare la funzione (res.send()?)
    fileExplorerController.getUpdatedFileList(res);
});

/**
 *  ​API che si occupa della notifica del client tramite il socket
 *  che è stato cambiato correttamente l'endpoint video.
 * @param {object} req - Rappresenta la richiesta http contenente il booleano done
 * @param {object} res - Rappresenta la risposta http
 */
ahl.post('/notifyNewVideoEndpoint', (req,res) => {
    if(req.body.Type == "SubscriptionConfirmation"){
        if(sns.confirmTopic(req.body.TopicArn, req.body.Token)){
            console.log("Confirmed subscription " + req.body.TopicArn);
            res.sendStatus(200);
        }
        else
            res.sendStatus(422);
    }
    else{
        if(req.body.Type == "Notification" && req.body.Message == 'videoEndpoint'){
            res.sendStatus(200);
            const videoKey = req.body.MessageAttributes.key.StringValue;
            editController.changeVideo(videoKey);
            if(activePage != pages.edit){
                activePage = pages.edit;
                backport.send('refresh','');
            }
            else {
                if(!editController.isOriginalView())
                    backport.send('newVideo','');
            }
        }
        else
            res.sendStatus(418);
    }
});
let endpointPromise = SNS.subscribe({
    Protocol: 'http',
    TopicArn: sns.getTopicArn('confirmation',AWS.config.region,"693949087897"),
    Endpoint: endpointName + "notifyNewVideoEndpoint"
}).promise();
progressionPromise.then( data => console.log("Requested subscription ",data)).catch(err => console.log(
    "Subscription Error " + err,err.stack));


/**
 * API che inoltra la richiesta di modifica di una riga dei riconoscimenti all'editModel
 */
ahl.post('/changeRow', (req,res) => {
    const data = req.body;
    res.send(editController.changeRowValue(data.row, data.start, data.duration, data.label));
});

/**
 * API che inoltra la richiesta di reset della tabella dei riconoscimenti
 */
ahl.post('/resetTable', (req, res) => {
    res.send(editController.resetRecognizements ());
});

/**
 * API per la richiesta di cancellazione del lavoro in corso
 */
ahl.post('/cancelJob', (req,res) => {
   res.send(editController.cancelExecution());
});
