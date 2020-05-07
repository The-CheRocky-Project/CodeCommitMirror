const assert = require('assert');
var rewire = require('rewire');
var mock = require('mock-require');
var loadingController = rewire('../../src/controllers/loadingController.js');

describe('testLoadingController',() => {

  describe('#getBody(res)', () => {

    it("deve invocare la stampa dell'XHTML della progress bar iniziale", (done) => {

      let printIsCalled = false;

      mock('../../src/views/loadingView', { print: function(res) {
        printIsCalled = true;
      }});


      let res = 'resMock';

      let vMock = require('../../src/views/loadingView');

      loadingController.__set__('view', vMock);

      loadingController.getBody(res);

      assert.equal(printIsCalled,true);
      done();
    });
  });
});
