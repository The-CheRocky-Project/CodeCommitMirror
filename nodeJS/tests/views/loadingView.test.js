const view = require('../../src/views/loadingView');
const assert = require('assert');

describe('testLoadingView', () => {
    describe('#print()', () => {
        it("should render the loadingTemplate", () =>{
            let mockRes = {
                viewName: "",
                viewData: {},
                render: function(viewName, viewData) {
                    this.viewName = viewName;
                    this.viewData = viewData;
                }
            };
            view.print(mockRes);
            assert.equal(mockRes.viewName,"layouts/loadingTemplate");
        });
    });
});