const assert = require('assert');
var rewire = require('rewire');
var mock = require('mock-require');
var editController = rewire('../../src/controllers/editController.js');
var editController1 = require('../../src/controllers/editController');

describe('testEditController',() => {

  describe('#addNewLabelRow()', () => {

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
    it("deve aggiornare il rendering della tabella dei riconoscimenti.", () => {
      let getRecongnizementListIsCalled = false;
      mock('../../src/models/editModel', { getRecongnizementList: function() {
        getRecongnizementListIsCalled = true;
      }});
      let generateTableIsCalled = false;
      mock('../../src/views/editView', { generateTable: function(rekoList, res){
        generateTableIsCalled = true;
      }})
      let mMock = require('../../src/models/editModel');
      let vMock = require('../../src/views/editView');
      let res = 'resMock';
      editController.__set__('model', mMock);
      editController.__set__('view', vMock);
      editController.updateLabelTable(res);
      var expected = true;
      var result = generateTableIsCalled && getRecongnizementListIsCalled;
      assert.equal(result,expected);
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
      let getVideoTypeIsCalled = false;
      mock('../../src/models/editModel', { 
        getVideoEndpoint: function() {
          getVideoEndpointIsCalled = true;
        },
        getVideoType: function() {
          getVideoTypeIsCalled = true;
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
      var result = getVideoEndpointIsCalled && generateVideoFrameIsCalled && getVideoTypeIsCalled;
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

    /*it("Calcola la durata totale dei riconoscimenti presenti in lista e verifica se è minore 5 minuti", () => {
      class single{
        constructor(duration){
          this.duration = duration;
        }
      }
      var recognizerList = [new single(10302), new single(40000), new single(20000)];
      var calcOvertime = editController.__get__('calculateOvertime');
      var result = calcOvertime(recognizerList);
      var expected = false;
      assert.equal(result,expected);
    });*/

    it("Calcola la durata totale dei riconoscimenti presenti in lista e verifica se maggiore di 5 minuti", () => {
      /**
       * function calculateOvertime(recognizerList){
              let sum=0;
              for(const single in recognizerList)
                  sum+=single.duration;
              return sum>300000
          }
       */
      /*class single{
        constructor(duration){
          this.duration = duration;
        }
      }*/
      //var singole = { "duration":"333322" };
      //var recognizerList = [singole, singole, singole, singole];
      /*var recognizerList = {
        "duration": 100000,
        "duration": 200000,
        "duration": 434434,
      }*/
      const recognizerList = {
        duration: 20323222 
      }
      console.log(recognizerList);
      //var calcOvertime = editController.__get__('calculateOvertime');
      var result = editController1.calculateOvertime(recognizerList);
      var expected = true;
      assert.equal(expected, result);
    });
  });
});
