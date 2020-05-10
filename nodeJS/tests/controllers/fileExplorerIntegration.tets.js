const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const fileExplorerController = rewire('../../src/controllers/fileExplorerController.js');
const fileExplorerModel = rewire('../../src/models/fileExplorerModel.js');
const fileExplorerView = rewire('../../src/views/fileExplorerView.js');

//const AWSMock = require('aws-sdk-mock');


describe('test integrazione fileExplorer', () => {

  describe('#getBody()', () => {

    let mockRes = null;

    before(() => {

      mock('../../src/wrappers/s3Wrapper', {
        listObjects: (bucket, prefix) => {
          return Array('Video1.mp4', 'Video2.mp4');
        },
        getObjectUrl: (fileKey, bucket, region) =>{
          return 'httpdelfile';
        }
      });

      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      fileExplorerModel.__set__('s3Wrap', s3wrapMock);

    });

    it('Deve chiamare la getBody e ritornare una pagina XHTML', (done) => {

      fileExplorerController.getBody(mockRes).then(() => {
        //console.log(mockRes.viewData.layout);
        assert.ok(mockRes.viewData.layout);
        done();
      }).catch((error) => {
        done(new Error(error));
      });

    });

  });

  describe('#getUpdatedFileList()', () => {

    let mockRes = null;

    before(() => {

      mock('../../src/wrappers/s3Wrapper', {
        listObjects: (bucket, prefix) => {
          return Array('Video1.mp4', 'Video2.mp4');
        },
        getObjectUrl: (fileKey, bucket, region) =>{
          return 'httpdelfile';
        }
      });

      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };

      const s3wrapMock = require('../../src/wrappers/s3Wrapper');

      fileExplorerModel.__set__('s3Wrap', s3wrapMock);

    });

    it('Deve chiamare la getBody e ritornare una pagina XHTML', (done) => {

      fileExplorerController.getUpdatedFileList(mockRes).then(() => {
        //console.log(mockRes.viewData.layout);
        assert.ok(!mockRes.viewData.layout);
        done();
      }).catch((error) => {
        done(new Error(error));
      });

    });

  });

  // describe('#launchFileProcessing()', () => {
  // NON FATTA PER PROBLEMA MESSAGE DEL TopicArn
  //   before();
  //
  //   it();
  //
  // });

});
