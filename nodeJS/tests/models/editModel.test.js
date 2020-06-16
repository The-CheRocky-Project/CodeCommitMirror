const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
var AWSMock = require('aws-sdk-mock');
const editModel = rewire('../../src/models/editModel.js');

describe('testEditModel', () => {

  describe('#getVideoEndpoint()', () => {

    it('Deve ritornare true se la chiamata è avvenuta con successo', () => {

      let getObjectUrlS3Wrap = false;

      mock('../../src/wrappers/s3Wrapper', {
        getObjectUrl: (fileKey, bucket, region) => {
          getObjectUrlS3Wrap = true;
          return true;
        }
      });

      const fileKey = 'fileKeyMock';
      const bucket = 'bucketMock';
      const region = 'regionMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      editModel.__set__('s3Wrap', s3wrapMock);

      let risultato = editModel.getVideoEndpoint();

      assert.equal(risultato, true);
      assert.equal(getObjectUrlS3Wrap, true);

    });

    it('Deve ritornare true se la chiamata è avvenuta con successo', () => {

      let getObjectUrlS3Wrap = false;

      let result= editModel.__get__("actualVideoKey");

      mock('../../src/wrappers/s3Wrapper', {
        getObjectUrl: (fileKey, bucket, region) => {
          getObjectUrlS3Wrap = true;
          return true;
        }
      });

      const fileKey = 'fileKeyMock';
      const bucket = 'bucketMock';
      const region = 'regionMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      editModel.__set__('s3Wrap', s3wrapMock);

      let risultato = editModel.getVideoEndpoint();

      assert.equal(risultato, true);
      assert.equal(getObjectUrlS3Wrap, true);

    });

    it('Deve ritornare false se la chiamata non è avvenuta con successo', () => {

      let getObjectUrlS3Wrap = false;

      mock('../../src/wrappers/s3Wrapper', {
        getObjectUrl: (fileKey, bucket, region) => {
          getObjectUrlS3Wrap = true;
          return false;
        }
      });

      const fileKey = 'fileKeyMock';
      const bucket = 'bucketMock';
      const region = 'regionMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      editModel.__set__('s3Wrap', s3wrapMock);

      let risultato = editModel.getVideoEndpoint();

      assert.equal(risultato, false);
      assert.equal(getObjectUrlS3Wrap, true);

    });

  });

   describe('#getRecognizementList()', () => {

    it('Deve ritornare true se chiamata avvenuta correttamente', (done) => {

      let getJsonFileS3Wrap = false;

      mock('../../src/wrappers/s3Wrapper', {
        getJsonFile: (bucket, fileKey) => {
          getJsonFileS3Wrap = true;
          return true;
        }
      });

      const bucket = 'bucketMock';
      const fileKey = 'fileKeyMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      editModel.__set__('s3Wrap', s3wrapMock);

      editModel.getRecognizementList().then((token) => {

        assert.equal(token, true);
        assert.equal(getJsonFileS3Wrap, true);
        done();

      });

    });

    it('Deve ritornare false se chiamata non avvenuta correttamente', (done) => {

      let getJsonFileS3Wrap = false;

      mock('../../src/wrappers/s3Wrapper', {
        getJsonFile: (bucket, fileKey) => {
          getJsonFileS3Wrap = true;
          return false;
        }
      });

      const bucket = 'bucketMock';
      const fileKey = 'fileKeyMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      editModel.__set__('s3Wrap', s3wrapMock);

      editModel.getRecognizementList().then((token) => {

        assert.equal(token, false);
        assert.equal(getJsonFileS3Wrap, true);
        done();

      });

    });

  });

  describe('#setPreviewMode()', () => {

    it('Ritorna true se ha avuto successo', () => {

      const result = editModel.setPreviewMode();
      assert.equal(result,true);
      assert.equal(!editModel.isVideoTypeOriginal(), true);

    });

  });

  describe('#setOriginalMode()', () => {

    it('Ritorna true se ha avuto successo', () => {

      const result = editModel.setOriginalMode();
      assert.equal(result,true);
      assert.equal(editModel.isVideoTypeOriginal(), true);

    });

  });

  describe('#getmodelLabels()', () => {

    it('Deve restituire un dizionario JSON', (done) => {

      let getJsonFileS3Wrap = false;

      mock('../../src/wrappers/s3Wrapper', {
        getJsonFile: (bucket, fileKey) => {
          getJsonFileS3Wrap = true;
          return true;
        }
      });

      const bucket = 'bucketMock';
      const fileKey = 'fileKeyMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      editModel.__set__('s3Wrap', s3wrapMock);

      editModel.getmodelLabels().then((token) => {

        assert.equal(token, true);
        assert.equal(getJsonFileS3Wrap, true);
        done();

      });

    });

  });

  describe('#addRow()', () => {

    it('Ritorna dizionario JSON con specifiche da inseire nella riga', (done) => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestTrue');

      editModel.__set__('snsWrap', snsWrapperMock);

      const params = 'paramMock';

      editModel.addRow(params).then((token) => {

        assert.equal(token, true);
        done();

      });

    });

  });

  describe('#sendConfirmation()', () => {

    it('Ritorna true se ha avuto successo', () => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestTrue');

      editModel.__set__('snsWrap', snsWrapperMock);

      let risultato = editModel.sendConfirmation();

      assert.equal(risultato, true);

    });

    it('Ritorna false se non ha avuto successo', () => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestFalse');

      editModel.__set__('snsWrap', snsWrapperMock);

      let risultato = editModel.sendConfirmation();

      assert.equal(risultato, false);

    });

  });

  describe('#isVideoTypeOriginal()', () => {

    it('Deve ritorna true se il video in riproduzione è quello originale', () => {

      editModel.__set__('actualVideoKey.original', true);

      let risultato = editModel.isVideoTypeOriginal();

      assert.equal(risultato, true);

    });

    it('Deve ritorna false se il video in riproduzione è quello originale', () => {

      editModel.__set__('actualVideoKey.original', false);

      let risultato = editModel.isVideoTypeOriginal();

      assert.equal(risultato, false);

    });

  });

  describe('#updateRow()', () => {

    it('Deve ritornare true se la chiamata è stata effettuata correttamente', (done) => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestTrue');

      editModel.__set__('snsWrap', snsWrapperMock);

      const params = 'paramsMock';

      editModel.updateRow(params).then((token) => {

        assert.equal(token, true);
        done();

      })

    });

    it('Deve ritornare false se la chiamata non è stata effettuata correttamente', (done) => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestFalse');

      editModel.__set__('snsWrap', snsWrapperMock);

      const params = 'paramsMock';

      editModel.updateRow(params).then((token) => {

        assert.equal(token, false);
        done();

      });

    });

  });

  describe('#uncheckRow()', () => {

    it('Ritorna true se la chiamata è stata effettuata correttamente', (done) => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestTrue');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.uncheckRow(index).then((token) => {

        assert.equal(token, true);
        done();

      });

    });

    it('Ritorna false se la chiamata non è stata effettuata correttamente', (done) => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestFalse');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.uncheckRow(index).then((token) => {

        assert.equal(token, false);
        done();

      });

    });

  });

  describe('#checkRow()', () => {

    it('Ritorna true se la chiamata è stata effettuata correttamente', (done) => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestTrue');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.checkRow(index).then((token) => {

        assert.equal(token, true);
        done();

      });

    });

    it('Ritorna false se la chiamata non  è stata effettuata correttamente', (done) => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestFalse');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.checkRow(index).then((token) => {

        assert.equal(token, false);
        done();

      });

    });

  });

  describe('#sendReset()', () => {

    it('Deve effettuare la richiesta di reset della tabella dei riconoscimenti', () => {

      const snsWrapperMock = require('../wrappers/snsWrapperMockForTestTrue');

      editModel.__set__('snsWrap', snsWrapperMock);

      result=editModel.sendReset();

      assert.equal(result, true);

    });

  });

  describe('#sendJobCancellation()', ()=> {

    it("Avvia la cancellazione del Job", (done) => {
      AWSMock.mock('StepFunctions', 'startExecution', (params,callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });
      var expectedValue=true;
      var result= editModel.sendJobCancellation();
      result.then(function (res) {
        assert.deepStrictEqual(res,expectedValue);
        done();
      }).catch(function (errOnAssert) {
        done(new Error(errOnAssert));
      })
      AWSMock.restore('StepFunctions', 'startExecution');
    });
  });

// TODO add test again
  // describe('#setVideoEndpoint()', ()=> {
  //
  //   it("Imposta l'Endpoint con successo", () => {
  //     let expectedValue="file";
  //     editModel.setVideoEndpoint(expectedValue);
  //     let result= editModel.__get__("actualVideoKey");
  //     assert.equal(result.partialKey,expectedValue);
  //   });
  // });
});
