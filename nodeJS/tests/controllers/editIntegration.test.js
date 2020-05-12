const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const editController = rewire('../../src/controllers/editController.js');

const AWSMock = require('aws-sdk-mock');

describe('test integrazione edit', () => {

  describe('#getBody()', () => {

    it('Deve effettuare il rendering del body della pagina di visualizzazione dei risultati dell\'elaborazione.', () => {

      let mockRes = null;
      mockRes = {
          viewName: "",
          viewData: {},
          render: function(viewName, viewData) {
              this.viewName = viewName;
              this.viewData = viewData;
          }
      };

      let bucket = "prova";
      let fileKey = "prova.json";
      let response = {
          Body: '{"campo1":"prova","campo2":"ciao"}'
      }
      AWSMock.mock('S3', 'getObject', (params, callback) => {
          callback(null, response);
      });

      editController.getBody(mockRes);
      assert.ok(mockRes.viewData.layout);

    });
  });

  // describe('#changeVideoMode()', () => {
  //
  //   it('deve impostare la modalità di visualizzazione su original', () => {
  //     editController.changeVideoMode(true);
  //   });
  //
  // });

});
