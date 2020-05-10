const assert = require('assert');
const rewire = require('rewire');
const mock = require('mock-require');
const loadingController = rewire('../../src/controllers/loadingController.js');
const loadingView = rewire('../../src/views/loadingView.js');

describe('Test integrazione loadingController', () => {

  let mockRes = null;

  before(() => {

    mockRes = {
        viewName: "",
        viewData: {},
        render: function(viewName, viewData) {
            this.viewName = viewName;
            this.viewData = viewData;
        }
    };

  });

  it('Deve chiamare la getBody e ritornare una pagina XHTML', () => {

    loadingController.getBody(mockRes);
      //console.log(mockRes.viewData.layout);
    assert.strictEqual(mockRes.viewName,"layouts/loadingTemplate");

  });

});
