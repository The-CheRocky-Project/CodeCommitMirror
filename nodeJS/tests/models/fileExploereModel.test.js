const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const fileExplorerModel = rewire('../../src/models/fileExplorerModel.js');

describe('testFileExplorerModel', () =>{

  describe('#listFileKeys()', () => {

    it('Deve ritornare un array di file come stringa', () => {

      let listObjectsS3Wrap = false;

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

      assert.equal(listObjectsS3Wrap, true);

    });

  });

  describe('#getThumbnailURL()', () => {

    it('Deve ritorna una stringa del URL del video', () => {

      let getObjectUrlS3Wrap = false;

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

      assert.equal(getObjectUrlS3Wrap, true);

    });

  });

  describe('#processFile()', () => {

    it('Deve ritornare true se invia messaggio SNS', () => {

      let messageSNSWrap = false;

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

      let risultato = fileExplorerModel.processFile(fileKey);

      assert.equal(risultato, true);
      assert.equal(messageSNSWrap, true);

    });

    it('Deve ritornare false se non invia messaggio SNS', () => {

      let messageSNSWrap = false;

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

       let risultato = fileExplorerModel.processFile(fileKey);

       assert.equal(risultato, false);
       assert.equal(messageSNSWrap, true);

    });

  });

});
