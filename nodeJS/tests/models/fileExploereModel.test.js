const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const fileExplorerModel = rewire('../../src/models/fileExplorerModel.js');

describe('Test fileExplorerModel', () =>{
  describe('#listFileKeys()', () => {

    let listObjectsS3Wrap = false;

    before(() => {

      mock('../../src/wrappers/s3Wrapper', {
        listObjects: (bucket, prefix) => {
          //console.log('printMockato');
          listObjectsS3Wrap = true;
          let stringa = Array('Questo è un array di stringhe');
          return stringa;
        }
      });

      const bucket = 'bucketMock';
      const prefix = 'prefixMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      fileExplorerModel.__set__('s3Wrap', s3wrapMock);

      fileExplorerModel.listFileKeys();

    });

    it('Deve ritornare un array di file come stringa', () => {

      assert.equal(listObjectsS3Wrap, true);

    });

  });

  describe('#getThumbnailURL(fileKey)', () => {

    let getObjectUrlS3Wrap = false;

    before(() => {

      mock('../../src/wrappers/s3Wrapper', {
        getObjectUrl: (fileKey, bucket, region) => {
          //console.log('printMockato');
          getObjectUrlS3Wrap = true;
          let stringa = 'Questa è una stringa';
          return stringa;
        }
      });

      const fileKey = 'fileKeyMock';
      const bucket = 'bucketMock';
      const region = 'regionMock';

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      fileExplorerModel.__set__('s3Wrap', s3wrapMock);

      fileExplorerModel.getThumbnailURL(fileKey);

    });

    it('Deve ritorna una stringa del URL del video', () => {

      assert.equal(getObjectUrlS3Wrap, true);

    });

  });

  describe('#processFileTrue(fileKey)', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          //console.log('printMockato');
          messageSNSWrap = true;
          return true;
        }
      });

      const fileKey = 'fileKeyMock';

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      fileExplorerModel.__set__('snsWrap', snsWrapperMock);

      fileExplorerModel.processFile(fileKey);

    });

    it('Deve ritornare true se invia messaggio SNS', () => {

      assert.equal(messageSNSWrap, true);

    });

  });

  describe('#processFileFalse(fileKey)', () => {

    let messageSNSWrap = false;

    before(() => {

      mock('../../src/wrappers/snsWrapper', {
        message: () => {
          //console.log('printMockato');
          messageSNSWrap = true;
          return false;
        }
      });

      const fileKey = 'fileKeyMock';

      const snsWrapperMock = require('../../src/wrappers/snsWrapper');

      fileExplorerModel.__set__('snsWrap', snsWrapperMock);

      fileExplorerModel.processFile(fileKey);

    });

    it('Deve ritornare false se non invia messaggio SNS', () => {

      assert.equal(messageSNSWrap, true);

    });

  });

});
