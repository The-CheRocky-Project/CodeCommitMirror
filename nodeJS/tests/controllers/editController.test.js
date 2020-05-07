const assert = require('assert');
var rewire = require('rewire');
var mock = require('mock-require');
var editController = rewire('../../src/controllers/editController.js');

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
});
