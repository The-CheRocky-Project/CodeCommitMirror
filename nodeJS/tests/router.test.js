var rewire = require('rewire');
const request = require('supertest');
var mock = require('mock-require');
// var router = require('../src/router.js');
var router = rewire('../src/router.js');
var ahl = router.__get__('ahl');

describe('testRouter', () => {

    describe('#get/', () => {

        before(() => {
            var activePageMock = {
                getBody: (res) => {
                    res.send()
                }
            }

            router.__set__("activePage", activePageMock);
        });

        it("deve invocare il getBody della pagina attiva", (done) => {

            request(ahl).get('/').set('Accept', 'application/json')
                .expect(200, done);

        });
    });

    describe('#get/toFileExplorer', () => {

        it("setta la pagina attiva a fileExplorer", (done) => {

            request(ahl).get('/toFileExplorer').set('Accept', 'application/json')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(200, done);

        });
    });

    describe('#get/toLoading', () => {

        it("setta la pagina attiva a loading", (done) => {

            request(ahl).get('/toLoading').set('Accept', 'application/json')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(200, done);

        });
    });

    describe('#get/toEdit', () => {

        it("setta la pagina attiva a edit", (done) => {

            request(ahl).get('/toEdit').set('Accept', 'application/json')
                .expect('Content-Type', 'text/html; charset=utf-8')
                .expect(200, done);

        });
    });
    describe('#post/getTable', () => {

        before(() => {

            mock('../src/controllers/editController', {
                updateLabelTable: async (res) => {
                    res.send();
                    return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);

        });


        it("deve inviare un niente per ricevere la tabella delle label aggiornata", (done) => {

            request(ahl).post('/getTable')
                .send({fileKey: 'john'})
                .set('Accept', 'application/json')
                .expect(200, done);
        });
    });


    describe('#post/selectFile', () => {

        before(() => {

            mock('../src/controllers/fileExplorerController', {
                launchFileProcessing: (res) => {
                    return true;
                }
            });
            const fileExplorerControllerMock = require('../src/controllers/fileExplorerController');
            router.__set__('fileExplorerController', fileExplorerControllerMock);

        });


        it("deve inviare un json con una fileKey", (done) => {

            request(ahl).post('/selectFile')
                .send({fileKey: 'john'})
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });

    describe('#post/notifyLabelRowChange', () => {

        it("deve confermare l'avvenuta subcription sns", (done) => {

            request(ahl).post('/notifyLabelRowChange')
                .send({
                    Type: "SubscriptionConfirmation",
                    TopicArn: "john",
                    Token: "token"
                })
                .set('Accept', 'application/json')
                .expect(200, done);

        });

        it("deve avvisare il socket che è cambiata una riga", (done) => {

            request(ahl).post('/notifyLabelRowChange')
                .send({
                    Type: "Notification",
                    Message: "update",
                })
                .set('Accept', 'application/json')
                .expect(200, done);

        });

        it("deve avvisare con un 418 che la richiesta non è corretta", (done) => {

            request(ahl).post('/notifyLabelRowChange')
                .send({
                    Type: "TipoSbagliato",
                    Message: "update",
                })
                .set('Accept', 'application/json')
                .expect(418, done);

        });
    });

    describe('#post/includeLabel', () => {

        before(() => {

            mock('../src/controllers/editController', {
                changeRowCheckBox: (index, checked) => {
                    return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);

        });

        it("deve inviare un json con una rowIndex", (done) => {

            request(ahl).post('/includeLabel')
                .send({index: '16'})
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });


    describe('#post/excludeLabel', () => {

        before(() => {

            mock('../src/controllers/fileExplorerController', {
                uncheckLabel: (res) => {
                    //console.log(res);
                    // return true;
                }
            });
            const fileExplorerControllerMock = require('../src/controllers/fileExplorerController');
            router.__set__('fileExplorerController', fileExplorerControllerMock);

        });

        it("deve inviare un json con una rowIndex", (done) => {

            request(ahl).post('/excludeLabel')
                .send({rowIndex: 'john'})
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });

    describe('#post/getVideoFrame', () => {

        before(() => {

            mock('../src/controllers/editController', {
                updateVideoFrame: (res) => {
                    res.send();
                    return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);

        });

        it("deve inviare un json con una rowIndex", (done) => {

            request(ahl).post('/getVideoFrame')
                .send({rowIndex: 'john'})
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });

    describe('#post/addLabel', () => {

        before(() => {

            mock('../src/controllers/editController', {
                addNewLabelRow: (start, duration, modelIndex) => {
                    //console.log(start, duration, modelIndex);
                    // return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);

        });

        it("deve inviare un json con start, duration, modelIndex", (done) => {

            request(ahl).post('/addLabel')
                .send({
                    modelIndex: 2,
                    start: 3,
                    duration: 4
                })
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });

    describe('#post/setOriginalVideoMode', () => {

        before(() => {

            mock('../src/controllers/editController', {
                changeVideoMode: (toOriginal) => {
                    //console.log(toOriginal);
                    // return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);

        });

        it("deve accettare la richiesta", (done) => {

            request(ahl).post('/setOriginalVideoMode')
                .send()
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });

    describe('#post/setPreviewVideoMode', () => {

        before(() => {

            mock('../src/controllers/editController', {
                changeVideoMode: (toOriginal) => {
                    //console.log(toOriginal);
                    // return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);

        });

        it("deve  accettare la richiesta", (done) => {

            request(ahl).post('/setPreviewVideoMode')
                .send()
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });


    describe('#post/notifyEditingFinish', () => {

        it("inviare un json con la conferma di sottoscrizione", (done) => {

            request(ahl).post('/notifyEditingFinish')
                .send({
                    Type: "SubscriptionConfirmation",
                    TopicArn: "confirmationArn",
                    Token: "token"
                })
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it("deve notificare il socket è terminata l'esecuzione", (done) => {

            request(ahl).post('/notifyEditingFinish')
                .send({
                    Type: "Notification",
                    Message: "finish"
                })
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it("deve avvisare con un 418 che la richiesta non è corretta", (done) => {

            request(ahl).post('/notifyEditingFinish')
                .send({
                    Type: "TipoSbagliato",
                })
                .set('Accept', 'application/json')
                .expect(418, done);
        });
    });

    describe('#post/notifyChangedFileList', () => {

        it("inviare? un json quello che gli pare", (done) => {

            request(ahl).post('/notifyChangedFileList')
                .send({
                    Type: "SubscriptionConfirmation",
                    TopicArn: "john",
                    Token: "token"
                })
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it("deve notificare il socket che è cambiata la lista dei file", (done) => {

            request(ahl).post('/notifyChangedFileList')
                .send({
                    Type: "Notification",
                })
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it("deve avvisare con un418 che la richiesta non è corretta", (done) => {

            request(ahl).post('/notifyChangedFileList')
                .send({
                    Type: "TipoSbagliato",
                })
                .set('Accept', 'application/json')
                .expect(418, done);
        });
    });

    describe('#post/confirmEdit', () => {

        before(() => {

            mock('../src/controllers/editController', {
                confirmEditing: () => {
                    return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);

        });

        it("inviare? un json quello che gli pare", (done) => {

            request(ahl).post('/confirmEdit')
                .send({
                    toOriginal: 2
                })
                .set('Accept', 'application/json')
                .expect(200, done);

        });
    });

    describe('#post/notifyProgressionUpdate', () => {

        it("deve confermare la subscription", (done) => {

            request(ahl).post('/notifyProgressionUpdate')
                .send({
                    Type: "SubscriptionConfirmation",
                    TopicArn: "Arn",
                    Token: "Token"
                })
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it("deve notificare il socket che la progression è cambiata", (done) => {

            request(ahl).post('/notifyProgressionUpdate')
                .send({
                    Type: "Notification",
                    Message: '{"progression": 100}'
                })
                .set('Accept', 'application/json')
                .expect(200, done);
        });

        it("deve avvisare con un 418 che la richiesta non è corretta", (done) => {

            request(ahl).post('/notifyProgressionUpdate')
                .send({
                    Type: "TipoSbagliato",
                })
                .set('Accept', 'application/json')
                .expect(418, done);
        });
    });

    describe('#post/notifyNewVideoEndpoint', () => {

        it("deve confermare l'avvenuta subcription sns", (done) => {

            request(ahl).post('/notifyNewVideoEndpoint')
                .send({
                    Type: "SubscriptionConfirmation",
                    TopicArn: "john",
                    Token: "token"
                })
                .set('Accept', 'application/json')
                .expect(200, done);

        });

        before(()=>{
            mock('../src/controllers/editController', {
                changeVideo: (videKey) => {
                    return true;
                }
            });
            const editControllerMock = require('../src/controllers/editController');
            router.__set__('editController', editControllerMock);
        })

        it("deve accettare notification", (done) => {
            request(ahl).post('/notifyNewVideoEndpoint')
                .send({
                    Type: "Notification",
                    Message: 'videoEndpoint',
                    MessageAttributes: {key:{ StringValue:"sport.mp4" }}
                })
                .set('Accept', 'application/json')
                .expect(200, done);
        });
    });


});
