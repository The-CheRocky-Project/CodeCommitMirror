const view = require('../../src/views/fileExplorerView');
const assert = require('assert');

describe('testFileExplorerView', () => {
    describe('#print()', () => {
        let mockRes;
        beforeEach(function() {
            mockRes = {
                viewName: "",
                viewData: {},
                render: function(viewName, viewData) {
                    this.viewName = viewName;
                    this.viewData = viewData;
                }
            };
        });
        it("should render the fileExplorerTemplate with main == false", () =>{
            let param = {};
            view.print(param,mockRes);
            assert.strictEqual(mockRes.viewName,"layouts/fileExplorerTemplate");
            assert.ok(!mockRes.viewData.layout);
        });
        it("should render the fileExplorerTemplate with main == true", () =>{
            let param = {main:true};
            view.print(param,mockRes);
            assert.strictEqual(mockRes.viewName,"layouts/fileExplorerTemplate");
            assert.ok(mockRes.viewData.layout);
        });
    });
});