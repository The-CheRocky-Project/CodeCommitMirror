const view = require('../../src/views/fileExplorerView');
const assert = require('assert');

describe('testFileExplorerView', () => {
    describe('#print()', () => {
        it("should render the fileExplorerTemplate", () =>{
            let param = {};
            let mockRes = {
                viewName: "",
                viewData: {},
                render: function(viewName, viewData) {
                    this.viewName = viewName;
                    this.viewData = viewData;
                }
            };
            view.print(param,mockRes);
            assert.strictEqual(mockRes.viewName,"layouts/fileExplorerTemplate");
        });
    });
});