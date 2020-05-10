const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
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

    it('Ritorna true se ha avuto successo', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      editModel.setPreviewMode().then(() => {

        assert.equal(messageSNSWrap, true);
        done();

      });

    });

    it('Ritorna false se non ha avuto successo', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      editModel.setPreviewMode().then(() => {

        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#setOriginalMode()', () => {

    it('Ritorna true se ha avuto successo', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      editModel.setOriginalMode().then(() => {

        assert.equal(messageSNSWrap, true);
        done();

      });

    });

    it('Ritorna false se non ha avuto successo', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      editModel.setOriginalMode().then((token) => {

        assert.equal(messageSNSWrap, true);
        done();

      });

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

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      const params = 'paramMock';

      editModel.addRow(params).then((token) => {

        assert.equal(token, true);
        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#sendConfirmation()', () => {

    it('Ritorna true se ha avuto successo', () => {

      let messageSNSWrap = false;
      let risultato = null;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      risultato = editModel.sendConfirmation();

      assert.equal(risultato, true);
      assert.equal(messageSNSWrap, true);

    });

    it('Ritorna false se non ha avuto successo', () => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      let risultato = editModel.sendConfirmation();

      assert.equal(risultato, false);
      assert.equal(messageSNSWrap, true);

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

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      const params = 'paramsMock';

      editModel.updateRow(params).then((token) => {

        assert.equal(token, true);
        assert.equal(messageSNSWrap, true);
        done();

      })

    });

    it('Deve ritornare false se la chiamata non è stata effettuata correttamente', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      const params = 'paramsMock';

      editModel.updateRow(params).then((token) => {

        assert.equal(token, false);
        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#uncheckRow()', () => {

    it('Ritorna true se la chiamata è stata effettuata correttamente', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.uncheckRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, true);
        done();

      });

    });

    it('Ritorna false se la chiamata non è stata effettuata correttamente', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.uncheckRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, false);
        done();

      });

    });

  });

  describe('#checkRow()', () => {

    it('Ritorna true se la chiamata è stata effettuata correttamente', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.checkRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, true);
        done();

      });

    });

    it('Ritorna false se la chiamata non  è stata effettuata correttamente', (done) => {

      let messageSNSWrap = false;

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      const index = 'indexMock';

      editModel.checkRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, false);
        done();

      });

    });

  });

});
