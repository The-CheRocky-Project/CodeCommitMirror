const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const fileExplorerController = rewire('../../src/controllers/fileExplorerController.js');
const sinon = require('sinon');
//const fileExploereModel = rewire('../../src/models/fileExploereModel.js');
//const fileExplorerView = rewire('../../src/view/fileExplorerView.js');

describe('testFileExplorerController', () => {

  describe('#getBody()', () => {

    let printIsCalled = false;
    let listFileKeysModel = false;
    let getThumbnailURLModel = false;

    before(() => {

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

      fileExplorerController.getBody(param, res);

    });

    it('deve creare file XHTML fileExplorer', () => {

      assert.equal(printIsCalled, true);
      assert.equal(listFileKeysModel, true);
      assert.equal(getThumbnailURLModel, true);

    });

  });

  describe('#getUpdatedFileList()', () => {

    let printIsCalled1 = false;
    let listFileKeysModel1 = false;
    let getThumbnailURLModel1 = false;

    before(() => {

      mock('../../src/view/fileExplorerView', {
        print: (param, res) => {
          //console.log('printMockato');
          printIsCalled1 = true;
        }
      });

      mock('../../src/models/fileExplorerModel', {
        listFileKeys: async () => {
          //console.log('listFileKeysMockato');
          listFileKeysModel1 = true;
          let stringa = Array('Questo è un array di stringhe');
          return stringa;
        },
        getThumbnailURL: (fileKey) => {
          //console.log('getThumbnailURLMockato');
          getThumbnailURLModel1 = true;
          let stringa = Array('Questo è un array di stringhe');
          return stringa;
        }
      });

      const res = 'resMock';

      const fevMock = require('../../src/view/fileExplorerView');
      const femMock = require('../../src/models/fileExplorerModel');

      fileExplorerController.__set__('view', fevMock);
      fileExplorerController.__set__('model', femMock);

      fileExplorerController.getUpdatedFileList(res);

    });

    it('deve fare update file XHTML fileExplorer', () => {

      assert.equal(printIsCalled1, true);
      assert.equal(listFileKeysModel1, true);
      assert.equal(getThumbnailURLModel1, true);

    });

  });

  describe('#launchFileProcessingTrue()', () => {

    let preocessFileModel = false;

    before(() => {

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

    });

    it('Ritorna true se eseguita correttamente', () => {

      assert.equal(preocessFileModel, true);

    });

  });

  describe('#launchFileProcessingFalse()', () => {

    let preocessFileModel1 = true;

    before(() => {

      mock('../../src/models/fileExplorerModel', {
        processFile: (fileKey) => {
          //console.log('getThumbnailURLMockato');
          preocessFileModel1 = false;
          return false;
        }
      });

      const filekey = 'filekeyMock';

      const femMock = require('../../src/models/fileExplorerModel');

      fileExplorerController.__set__('model', femMock);

      fileExplorerController.launchFileProcessing(filekey);

    });

    it('Ritorna false se eseguita correttamente', () => {

      assert.equal(preocessFileModel1, false);

    });

  });

});
