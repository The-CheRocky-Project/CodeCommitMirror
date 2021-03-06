const assert = require('assert');
var rewire = require('rewire');
var mock = require('mock-require');
var editController = rewire('../../src/controllers/editController.js');

describe('testEditController',() => {

  describe('#changeRowValue()', () => {

    it("deve inserire un nuovo riconoscimento customizzato", () => {
      let updateRowIsCalled = false;
      mock('../../src/models/editModel', { updateRow: function(index,start,duration,label) {
        updateRowIsCalled = true;
      }});
      let index = 'indexMock', start = 'startMock', duration = 'durationMock', label = 'labelMock';
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      editController.changeRowValue(index, start, duration, label);
      var expected = true;
      assert.equal(updateRowIsCalled,expected);
    });
  });

  describe('#addNewLabelRow()', () => {

    it("deve inserire un nuovo riconoscimento customizzato.", () => {
      let addRowIsCalled = false;
      mock('../../src/models/editModel', { addRow: function(index,start,duration,label) {
        addRowIsCalled = true;
      }});
      let index = 'indexMock', start = 'startMock', duration = 'durationMock', label = 'labelMock';
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      editController.addNewLabelRow(index, start, duration, label);
      var expected = true;
      assert.equal(addRowIsCalled,expected);
    });
  });

  describe('#confirmEditing()', () => {

    it("deve notificare l’accettazione del contenuto della tabella al sistema", () => {
      let sendConfirmationIsCalled = false;
      mock('../../src/models/editModel', { sendConfirmation: function() {
        sendConfirmationIsCalled = true;
      }});
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      editController.confirmEditing();
      var expected = true;
      assert.equal(sendConfirmationIsCalled,expected);
    });
  });

  describe('#updateLabelTable()', () => {
    it("deve aggiornare il rendering della tabella dei riconoscimenti.", (done) => {
      let getRecognizementListIsCalled = false;
      let getmodelLabelsIsCalled = false;
      class single{
        constructor(duration){
          this.duration = duration;
        }
      }
      mock('../../src/models/editModel', {
        getRecognizementList: async function() {
          getRecognizementListIsCalled = true;
        },
        getmodelLabels: async function() {
          getmodelLabelsIsCalled = true;
        }
      });
      let printIsCalled = false;
      mock('../../src/views/editView', { generateTable: function(param, res) {
        printIsCalled = true;
      }});
      let mMock = require('../../src/models/editModel');
      let vMock = require('../../src/views/editView');
      editController.__set__('model', mMock);
      editController.__set__('view', vMock);
      const res = 'resMock';
      editController.updateLabelTable(res).then(
        (value) => {
          const expected = true;
          const result = getRecognizementListIsCalled &&
              getmodelLabelsIsCalled &&
              printIsCalled;
          assert.equal(result,expected);
          done();
        }
      );

    });
  });

  describe('#changeVideoMode()', () => {

    it("deve impostare la modalità di visualizzazione su original", () => {
      let setOriginalModeIsCalled = false;
      mock('../../src/models/editModel', { setOriginalMode: function() {
        setOriginalModeIsCalled = true;
      }});
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      let toOriginal = true;
      editController.changeVideoMode(toOriginal);
      var expected = true;
      assert.equal(setOriginalModeIsCalled,expected);
    });

    it("deve impostare la modalità di visualizzazione su preview", () => {
      let setPreviewModeIsCalled = false;
      mock('../../src/models/editModel', { setPreviewMode: function() {
        setPreviewModeIsCalled = true;
      }});
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      let toOriginal = false;
      editController.changeVideoMode(toOriginal);
      var expected = true;
      assert.equal(setPreviewModeIsCalled,expected);
    });
  });
  describe('#updateVideoFrame()', () => {

    it("deve generare e renderizzare il nuovo frame video", () => {
      let getVideoEndpointIsCalled = false;
      let isVideoTypeOriginalIsCalled = false;
      mock('../../src/models/editModel', {
        getVideoEndpoint: function() {
          getVideoEndpointIsCalled = true;
        },
          isVideoTypeOriginal: function() {
          isVideoTypeOriginalIsCalled = true;
        }
      });
      let generateVideoFrameIsCalled = false;
      mock('../../src/views/editView', { generateVideoFrame: function(videoEndpoint, isOriginal, res) {
        generateVideoFrameIsCalled = true;
      }});
      let mMock = require('../../src/models/editModel');
      let vMock = require('../../src/views/editView');
      editController.__set__('model', mMock);
      editController.__set__('view', vMock);
      var res = 'resMock';
      editController.updateVideoFrame(res);
      var expected = true;
      var result = getVideoEndpointIsCalled && generateVideoFrameIsCalled; //&& getVideoTypeIsCalled;
      assert.equal(result,expected);
    });
  });
  describe('#changeRowCheckBox()', () => {

    it("deve effettuare la richiesta di selezionare una riga di riconoscimento", () => {
      let checkRowIsCalled = false;
      mock('../../src/models/editModel', {
        checkRow: function(index) {
          checkRowIsCalled = true;
        },
      });
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      var index = 'indexMock', checked = true;
      editController.changeRowCheckBox(index, checked);
      var expected = true;
      var result = checkRowIsCalled;
      assert.equal(result,expected);
    });

    it("deve effettuare la richiesta di selezionare una riga di riconoscimento", () => {
      let uncheckRowIsCalled = false;
      mock('../../src/models/editModel', {
        uncheckRow: function(index) {
          uncheckRowIsCalled = true;
        },
      });
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      var index = 'indexMock', checked = false;
      editController.changeRowCheckBox(index, checked);
      var expected = true;
      var result = uncheckRowIsCalled;
      assert.equal(result,expected);
    });
  });
  describe('#changeRowValue()', () => {

    it("deve effettuare la richiesta al sistema di modificare una riga della tabella dei riconoscimenti", () => {
      let updateRowIsCalled = false;
      mock('../../src/models/editModel', {
        updateRow: function(index,start,duration,label) {
          updateRowIsCalled = true;
        },
      });
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      var res = 'resMock';
      let index = 'indexMock', start = 'startMock', duration = 'durationMock', label = 'labelMock';
      editController.changeRowValue(index,start,duration,label);
      var expected = true;
      var result = updateRowIsCalled;
      assert.equal(result,expected);
    });
  });

  describe('#calculateOvertime()', () => {

    it("Calcola la durata totale dei riconoscimenti presenti in lista e verifica se è minore 5 minuti", () => {
      let dizionarioJson = [{ 'duration': '24322' }];
      var calcOvertime = editController.__get__('calculateOvertime');
      var result = calcOvertime(dizionarioJson);
      var expected = false;
      assert.equal(expected, result);
    });

    it("Calcola la durata totale dei riconoscimenti presenti in lista e verifica se maggiore di 5 minuti", () => {
      //let dizionarioJson = [{'single': { 'duration': '2434365345622' }}];
      let dizionarioJson = [{ 'duration': '2434365345622' }];
      var calcOvertime = editController.__get__('calculateOvertime');
      var result = calcOvertime(dizionarioJson);
      var expected = true;
      assert.equal(expected, result);
    });
  });


  describe('#getBody()', () => {
    it("Deve effettuare il rendering del body della pagina di visualizzazione dei risultati dell'elaborazione.",(done)=>{
      let getVideoEndpointIsCalled = false;
      let getRecognizementListIsCalled = false;
      let getmodelLabelsIsCalled = false;
      let isVideoTypeOriginalIsCalled = false;
      class single{
        constructor(duration){
          this.duration = duration;
        }
      }
      mock('../../src/models/editModel', {
        getVideoEndpoint: function() {
          getVideoEndpointIsCalled = true;
        },
        getRecognizementList: async function() {
          getRecognizementListIsCalled = true;
        },
        getmodelLabels: async function() {
          getmodelLabelsIsCalled = true;
        },
        isVideoTypeOriginal: function() {
          isVideoTypeOriginalIsCalled = true;
        }
      });
      let printIsCalled = false;
      mock('../../src/views/editView', { print: function(param, res) {
        printIsCalled = true;
      }});
      let mMock = require('../../src/models/editModel');
      let vMock = require('../../src/views/editView');
      editController.__set__('model', mMock);
      editController.__set__('view', vMock);
      var res = 'resMock';
      editController.getBody(res).then(
        (value) => {
          var expected = true;
          var result = getVideoEndpointIsCalled &&
          getRecognizementListIsCalled &&
          getmodelLabelsIsCalled &&
          isVideoTypeOriginalIsCalled &&
          printIsCalled;
          assert.equal(result,expected);
          done();
        }
      );

    });
  });

  describe('#resetRecognizements()', () => {
    it("Deve utilizzare l'editModel per avviare la richiesta di reset della lista dei riconoscimenti",()=>{
      let sendResetIsCalled = false;
      mock('../../src/models/editModel', {
        sendReset: function() {
          sendResetIsCalled = true;
        }
      });
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      editController.resetRecognizements();
      assert.ok(sendResetIsCalled);
    });
  });

  describe('#cancelExecution()', () => {
    it("Deve richiedere la cancellazione del lavoro in atto",()=>{
      let sendJobCancellationIsCalled = false;
      mock('../../src/models/editModel', {
        sendJobCancellation: function() {
          sendJobCancellationIsCalled = true;
        }
      });
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      editController.cancelExecution();
      assert.ok(sendJobCancellationIsCalled);
    });
  });

  describe('#changeVideo()', () => {
    it("Deve cambiare il video visualizzato",()=>{
      let setVideoEndpointIsCalled = false;
      mock('../../src/models/editModel', {
        setVideoEndpoint: function(videoK) {
          setVideoEndpointIsCalled = true;
        }
      });
      let mMock = require('../../src/models/editModel');
      let videoK='str'
      editController.__set__('model', mMock);
      editController.changeVideo(videoK);
      assert.ok(setVideoEndpointIsCalled);
    });
  });

  describe('#isOriginalView()', () => {
    it("Deve ritornare se il video visualizzato è quello originale",()=>{
      let isVideoTypeOriginalIsCalled = false;
      mock('../../src/models/editModel', {
        isVideoTypeOriginal: function() {
          isVideoTypeOriginalIsCalled = true;
        }
      });
      let mMock = require('../../src/models/editModel');
      editController.__set__('model', mMock);
      editController.isOriginalView();
      assert.ok(isVideoTypeOriginalIsCalled);
    });
  });
});
