// initalize all the required modules
const express = require('express');
const ahl = express();
const http = require('http').createServer(ahl);
const port = process.env.PORT || 3000;
const path = require('path');
const handlebars = require('express-handlebars');


//creates a backport for the socket communication
const backport = require('socket.io')(http);

//publish CSS, client JS and images
ahl.use(express.static(path.join(__dirname,'/public')));

//refers different paths for every component
ahl.set('controllers',path.join(__dirname,'/controllers'));
ahl.set('models',path.join(__dirname,'models'));
ahl.set('views',path.join(__dirname,'views'));

// sets up the handlebars view engine
ahl.set('view engine','hbs');
ahl.engine('handlebars', handlebars({
    extname: 'hbs',
    layoutsDir: ahl.get('views')
}));

// initialize all the 3 controller
const fileExplorerController = require('./controllers/fileExplorerController');
const loadingController=require('./controllers/loadingController');
const editController=require('./controllers/editController');

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
});

ahl.all('/toLoading',(req,res) => {
    console.log('called toLoading');
    activePage = pages.loading;
    res.send('');
    setTimeout(() => {
        activePage = pages.edit;
        backport.emit('refresh','');
    },10000)
});

ahl.all('/toEdit',(req,res) => {
    console.log('called toEdit');
    activePage = pages.edit;
    res.send('');
});

// associate connection events to messages emit
backport.on('connection', (socket) => {
    console.log('user connected to io');
    socket.on('disconnect', () => {
        console.log('user disconnected from io');
    })
});

// notifyChangedFileList()
ahl.get('/notifyChangedFileList', (req, res, next) => {
    backport.emit('changeFile', req.body);
    res.send('');
});

//puts the server listening on the correct port
http.listen(port, function(){
    console.log('listening on *:' + port);
});
