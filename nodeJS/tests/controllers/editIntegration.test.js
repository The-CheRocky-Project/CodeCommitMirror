const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const editController = rewire('../../src/controllers/editController.js');

const AWSMock = require('aws-sdk-mock');

describe('test integrazione edit', () => {


  describe('#getBody()', () => {

    it('Deve effettuare il rendering del body della pagina di visualizzazione dei risultati dell\'elaborazione.', (done) => {

      let mockRes = null;
      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };

      let bucket = "prova";
      let fileKey = "prova.json";
      let response = {
          Body: '{"campo1":"prova","campo2":"ciao"}'
      }
      AWSMock.mock('S3', 'getObject', (params, callback) => {
          callback(null, response);
      });

      editController.getBody(mockRes).then(
        (data) => {
          assert.ok(mockRes.viewData.layout);
          done();
        }
      );


    });

    afterEach(()=>{
        AWSMock.restore('S3','getObject');
    });

  });

  describe('#changeVideoMode()', () => {

    it('deve impostare la modalità di visualizzazione su original se è true', (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });

      editController.changeVideoMode(true).then((token) => {
        assert.equal(token, true);
        done();
      });

    });

    it('non deve impostare la modalità di visualizzazione su original se è false', (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });

      editController.changeVideoMode(false).then((token) => {
        assert.equal(token, false);
        done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(()=>{
        AWSMock.restore('SNS','publish');
    });

  });

  describe('#updateVideoFrame()', () => {

    it("deve generare e renderizzare il nuovo frame video", () => {
      let mockRes = null;
      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };
      editController.updateVideoFrame(mockRes);
      assert.ok(!mockRes.viewData.layout);
    });
  });

  describe('#addNewLabelRow()', () => {

    it('deve inserire un nuovo riconoscimento customizzato se è true.', (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });

      let start = '1';
      let duration = '2';
      let labelModelIndex = '3';

      editController.addNewLabelRow(start, duration, labelModelIndex).then((token) => {
        assert.equal(token, true);
        done();
      });

    });

    it('non deve inserire un nuovo riconoscimento customizzato se è false.', (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });

      let start = '1';
      let duration = '2';
      let labelModelIndex = '3' ;

      editController.addNewLabelRow(start, duration, labelModelIndex).then((token) => {
        assert.equal(token, false);
        done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(()=>{
        AWSMock.restore('SNS','publish');
    });

  });

  describe('#changeRowCheckBox()', () => {

    it('deve effettuare la richiesta di selezionare una riga di riconoscimento e ritorna true', (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });

      let index = 'indexMock', checked = true;
      editController.changeRowCheckBox(index, checked).then((token) => {
        assert.equal(token, true);
        done();
      });

    });

    it('deve effettuare la richiesta di selezionare una riga di riconoscimento e ritorna false se non va a buon fine', (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });

      let index = 'indexMock', checked = false;
      editController.changeRowCheckBox(index, checked).then((token) => {
        assert.equal(token, false);
        done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(()=>{
        AWSMock.restore('SNS','publish');
    });

  });

  describe('#changeRowValue()', () => {

    it("deve effettuare la richiesta al sistema di modificare una riga della tabella dei riconoscimenti e ritorna true se va bene", (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });
      let index = 'indexMock', start = 'startMock', duration = 'durationMock', label = 'labelMock';

      editController.changeRowValue(index,start,duration,label).then((token) => {
        assert.equal(token, true);
        done();
      });

    });

    it("deve effettuare la richiesta al sistema di modificare una riga della tabella dei riconoscimenti e ritorna false se non va bene", (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });
      let index = 'indexMock', start = 'startMock', duration = 'durationMock', label = 'labelMock';

      editController.changeRowValue(index,start,duration,label).then((token) => {
        assert.equal(token, false);
        done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(()=>{
        AWSMock.restore('SNS','publish');
    });

  });


  describe('#updateLabelTable()', () => { //TODO sistemare questo test

    it('deve aggiornare il rendering della tabella dei riconoscimenti.', (done) => {

      // let response = {
      //     Body: '{"campo1":"prova","campo2":"ciao"}'
      // }
      object=[];
      let val = {
        Body: '{"url": "videoEndpoint","originalVideo": true,"error": false,"list": ["object"],"labels": {    "labels":[        "prima_label",        "seconda_label"    ]}}'
      };
      let response= val;

      AWSMock.mock('S3', 'getObject', (params, callback) => {
          callback(null, response);
      });

      let mockRes = null;
      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };

      editController.updateLabelTable(mockRes).then(
        (data) => {
          //TODO controllare che sia corretto dopo con gli altri
          assert.ok(mockRes.viewData.layout);
          done();
        }
      );


    });

    afterEach(() => {
      AWSMock.restore('S3','getObject');
    });

  });

  describe('#confirmEditing()', () => {

    it("deve notificare l’accettazione del contenuto della tabella al sistema ritorna true se ha successo", (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });

      editController.confirmEditing().then((token) => {
        assert.equal(token, true);
        done();
      });

    });

    it("deve notificare l’accettazione del contenuto della tabella al sistema ritorna false se non ha successo", (done) => {

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });

      editController.confirmEditing().then((token) => {
        assert.equal(token, false);
        done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(() => {
      AWSMock.restore('SNS','publish');
    });

  });

});
