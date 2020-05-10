const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const editModel = rewire('../../src/models/editModel.js');

describe('testEditModel', () => {

  describe('#getVideoEndpointTrue()', () => {

    let getObjectUrlS3Wrap = false;
    let risultato = null;

    before(() => {

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

      risultato = editModel.getVideoEndpoint();

    });

    it('Deve ritornare true se la chiamata è avvenuta con successo', () => {

      assert.equal(risultato, true);
      assert.equal(getObjectUrlS3Wrap, true);

    });

  });

  describe('#getVideoEndpointFalse()', () => {

    let getObjectUrlS3Wrap = false;
    let risultato = null;

    before(() => {

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

      risultato = editModel.getVideoEndpoint();

    });

    it('Deve ritornare false se la chiamata non è avvenuta con successo', () => {

      assert.equal(risultato, false);
      assert.equal(getObjectUrlS3Wrap, true);

    });
  });

   describe('#getRecognizementListTrue()', () => {

    let getJsonFileS3Wrap = false;

    before(() => {

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

    });

    it('Deve ritornare true se chiamata avvenuta correttamente', (done) => {

      editModel.getRecognizementList().then((token) => {

        assert.equal(token, true);
        assert.equal(getJsonFileS3Wrap, true);
        done();

      });

    });

  });

  describe('#getRecognizementListFalse()', () => {

    let getJsonFileS3Wrap = false;

    before(() => {

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

    });

    it('Deve ritornare false se chiamata non avvenuta correttamente', (done) => {

      editModel.getRecognizementList().then((token) => {

        assert.equal(token, false);
        assert.equal(getJsonFileS3Wrap, true);
        done();

      });

    });

  });

  describe('#setPreviewModeTrue()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna true se ha avuto successo', (done) => {

      editModel.setPreviewMode().then(() => {

        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#setPreviewModeFalse()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna false se non ha avuto successo', (done) => {

      editModel.setPreviewMode().then(() => {

        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#setOriginalModeTrue()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna true se ha avuto successo', (done) => {

      editModel.setOriginalMode().then(() => {

        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#setOriginalModeFalse()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna false se non ha avuto successo', (done) => {

      editModel.setOriginalMode().then((token) => {

        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#getmodelLabels()', () => {

    let getJsonFileS3Wrap = false;

    before(() => {

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

    });

    it('Deve restituire un dizionario JSON', (done) => {

      editModel.getmodelLabels().then((token) => {

        assert.equal(token, true);
        assert.equal(getJsonFileS3Wrap, true);
        done();

      });

    });

  });

  describe('#addRow()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna dizionario JSON con specifiche da inseire nella riga', (done) => {

      const params = 'paramMock';

      editModel.addRow(params).then((token) => {

        assert.equal(token, true);
        assert.equal(messageSNSWrap, true);
        done();

      });

    });

  });

  describe('#sendConfirmationTrue()', () => {

    let messageSNSWrap = false;
    let risultato = null;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      risultato = editModel.sendConfirmation();

    });

    it('Ritorna true se ha avuto successo', () => {

      assert.equal(risultato, true);
      assert.equal(messageSNSWrap, true);

    });

  });

  describe('#sendConfirmationFalse()', () => {

    let messageSNSWrap = false;
    let risultato = null;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

      risultato = editModel.sendConfirmation();

    });

    it('Ritorna false se non ha avuto successo', () => {

      assert.equal(risultato, false);
      assert.equal(messageSNSWrap, true);

    });

  });

  describe('#isVideoTypeOriginalTrue()', () => {

    let risultato = null;

    before(() => {

      editModel.__set__('actualVideoKey.original', true);

      risultato = editModel.isVideoTypeOriginal();

    });

    it('Deve ritorna true se il video in riproduzione è quello originale', () => {

      assert.equal(risultato, true);

    });

  });

  describe('#isVideoTypeOriginalFalse()', () => {

    let risultato = null;

    before(() => {

      editModel.__set__('actualVideoKey.original', false);

      risultato = editModel.isVideoTypeOriginal();

    });

    it('Deve ritorna true se il video in riproduzione è quello originale', () => {

      assert.equal(risultato, false);

    });

  });

  describe('#updateRowTrue()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Deve ritornare true se la chiamata è stata effettuata correttamente', (done) => {

      const params = 'paramsMock';

      editModel.updateRow(params).then((token) => {

        assert.equal(token, true);
        assert.equal(messageSNSWrap, true);
        done();

      })

    });

  });

  describe('#updateRowFalse()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Deve ritornare false se la chiamata non è stata effettuata correttamente', (done) => {

      const params = 'paramsMock';

      editModel.updateRow(params).then((token) => {

        assert.equal(token, false);
        assert.equal(messageSNSWrap, true);
        done();

      })

    });

  });

  describe('#uncheckRowTrue()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna true se la chiamata è stata effettuata correttamente', (done) => {

      const index = 'indexMock';

      editModel.uncheckRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, true);
        done();

      });

    });

  });

  describe('#uncheckRowTrue()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna false se la chiamata non è stata effettuata correttamente', (done) => {

      const index = 'indexMock';

      editModel.uncheckRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, false);
        done();

      });

    });

  });

  describe('#checkRowTrue()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return true;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna true se la chiamata è stata effettuata correttamente', (done) => {

      const index = 'indexMock';

      editModel.checkRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, true);
        done();

      });

    });

  });

  describe('#checkRowFalse()', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          messageSNSWrap = true;
          return false;
        }
      });

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      editModel.__set__('snsWrap', snsWrapperMock);

    });

    it('Ritorna false se la chiamata non  è stata effettuata correttamente', (done) => {

      const index = 'indexMock';

      editModel.checkRow(index).then((token) => {

        assert.equal(messageSNSWrap, true);
        assert.equal(token, false);
        done();

      });

    });

  });

});
