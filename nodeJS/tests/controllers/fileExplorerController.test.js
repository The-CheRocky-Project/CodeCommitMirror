const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const fileExplorerController = rewire('../../src/controllers/fileExplorerController.js');
const sinon = require('sinon');
//const fileExploereModel = rewire('../../src/models/fileExploereModel.js');
//const fileExplorerView = rewire('../../src/view/fileExplorerView.js');

describe('testFileExplorerController', () => {

  describe('#getBody()', () => {

    it('deve creare file XHTML fileExplorer', (done) => {

      let printIsCalled = false;
      let listFileKeysModel = false;
      let getThumbnailURLModel = false;

      mock('../../src/view/fileExplorerView', {
        print: (param, res) => {
          //console.log('printMockato');
          printIsCalled = true;
        }
      });

      mock('../../src/models/fileExplorerModel', {
        listFileKeys: async () => {
          //console.log('listFileKeysMockato');
          listFileKeysModel = true;
          let stringa = Array('Questo è un array di stringhe');
          return stringa;
        },
        getThumbnailURL: (fileKey) => {
          //console.log('getThumbnailURLMockato');
          getThumbnailURLModel = true;
          let stringa = Array('Questo è un array di stringhe');
          return stringa;
        }
      });

      const param = 'paramMock';
      const res = 'resMock';

      const fevMock = require('../../src/view/fileExplorerView');
      const femMock = require('../../src/models/fileExplorerModel');

      fileExplorerController.__set__('view', fevMock);
      fileExplorerController.__set__('model', femMock);

      console.log("prova del valore = " + this.param);

      fileExplorerController.getBody(param, res).then(() => {

        assert.equal(printIsCalled, true);
        assert.equal(listFileKeysModel, true);
        assert.equal(getThumbnailURLModel, true);

        done();

      });

    });

  });

  describe('#getUpdatedFileList()', () => {

    it('deve fare update file XHTML fileExplorer', (done) => {

      let printIsCalled = false;
      let listFileKeysModel = false;
      let getThumbnailURLModel = false;

      mock('../../src/view/fileExplorerView', {
        print: (param, res) => {
          //console.log('printMockato');
          printIsCalled = true;
        }
      });

      mock('../../src/models/fileExplorerModel', {
        listFileKeys: async () => {
          //console.log('listFileKeysMockato');
          listFileKeysModel = true;
          let stringa = Array('Questo è un array di stringhe');
          return stringa;
        },
        getThumbnailURL: (fileKey) => {
          //console.log('getThumbnailURLMockato');
          getThumbnailURLModel = true;
          let stringa = Array('Questo è un array di stringhe');
          return stringa;
        }
      });

      const res = 'resMock';

      const fevMock = require('../../src/view/fileExplorerView');
      const femMock = require('../../src/models/fileExplorerModel');

      fileExplorerController.__set__('view', fevMock);
      fileExplorerController.__set__('model', femMock);

      fileExplorerController.getUpdatedFileList(res).then(() => {

        assert.equal(printIsCalled, true);
        assert.equal(listFileKeysModel, true);
        assert.equal(getThumbnailURLModel, true);

        done();

      });

    });

  });

  describe('#launchFileProcessing()', () => {

    it('Ritorna true se eseguita correttamente', () => {

      let preocessFileModel = false;

      mock('../../src/models/fileExplorerModel', {
        processFile: (fileKey) => {
          //console.log('getThumbnailURLMockato');
          preocessFileModel = true;
          return true;
        }
      });

      const filekey = 'filekeyMock';

      const femMock = require('../../src/models/fileExplorerModel');

      fileExplorerController.__set__('model', femMock);

      fileExplorerController.launchFileProcessing(filekey);

      assert.equal(preocessFileModel, true);

    });

    it('Ritorna false se eseguita correttamente', () => {

      let preocessFileModel = true;
      let result = true;

      mock('../../src/models/fileExplorerModel', {
        processFile: (fileKey) => {
          //console.log('getThumbnailURLMockato');
          preocessFileModel = false;
          return false;
        }
      });

      const filekey = 'filekeyMock';

      const femMock = require('../../src/models/fileExplorerModel');

      fileExplorerController.__set__('model', femMock);

      fileExplorerController.launchFileProcessing(filekey);

      assert.equal(preocessFileModel, false);

    });

  });

});
