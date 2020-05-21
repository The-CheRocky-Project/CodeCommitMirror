const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const fileExplorerController = rewire('../../src/controllers/fileExplorerController.js');
//const fileExplorerModel = rewire('../../src/models/fileExplorerModel.js');
//const fileExplorerView = rewire('../../src/views/fileExplorerView.js');

const AWSMock = require('aws-sdk-mock');


describe('test integrazione fileExplorer', () => {

  describe('#getBody()', () => {

    it('Deve chiamare la getBody e ritornare una pagina XHTML', (done) => {

      let mockRes = null;

      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };

      let response = {
          Contents: [
              {Key: "happyface.mp4"},
              {Key: "test.mp4"}
          ]
      }

      AWSMock.mock('S3', 'listObjectsV2', (params, callback) => {
          callback(null, response);
      });

      fileExplorerController.getBody(mockRes).then(() => {
        //console.log(mockRes.viewData.layout);
        assert.ok(mockRes.viewData.layout);
        done();
      }).catch((error) => {
        done(new Error(error));
      });

    });

    afterEach(()=>{
        AWSMock.restore('S3','listObjectsV2');
    });

  });

  describe('#getUpdatedFileList()', () => {

    it('Deve chiamare la getBody e ritornare una pagina XHTML', (done) => {

      let mockRes = null;

      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };

      let response = {
          Contents: [
              {Key: "happyface.mp4"},
              {Key: "test.mp4"}
          ]
      }

      AWSMock.mock('S3', 'listObjectsV2', (params, callback) => {
          callback(null, response);
      });

      fileExplorerController.getUpdatedFileList(mockRes).then(() => {
        //console.log(mockRes.viewData.layout);
        assert.ok(!mockRes.viewData.layout);
        done();
      }).catch((error) => {
        done(new Error(error));
      });

    });

    afterEach(()=>{
        AWSMock.restore('S3','listObjectsV2');
    });

  });

  describe('#launchFileProcessing()', () => {

    it('Ritorna true se va a buon fine', (done) => {

      let fileKey = 'test';

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });

      fileExplorerController.launchFileProcessing(fileKey).then((token) => {
        assert.equal(token, true);
        done();
      });

    });

    it('Ritorna false se non va a buon fine', (done) => {

      let fileKey = 'test';

      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });

      fileExplorerController.launchFileProcessing(fileKey).then((token) => {
        assert.equal(token, false);
        done();
      }).catch((errOnAssert) => {done(new Error(errOnAssert));});

    });

    afterEach(()=>{
      AWSMock.restore('SNS', 'publish');
    });

  });

});
