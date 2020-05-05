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
            assert.strictEqual(mockRes.viewName,"layouts/loadingTemplate");
        });
    });
    describe('#generateProgressBar()', () => {
        it("should render the progress bar with the correct progression", () =>{
            let mockRes = {
                viewName: "",
                viewData: {},
                render: function(viewName, viewData) {
                    this.viewName = viewName;
                    this.viewData = viewData;
                }
            };
            let progress = 100;
            view.generateProgressBar(mockRes,progress);
            assert.strictEqual(mockRes.viewName,"partials/progressBar");
            assert.strictEqual(mockRes.viewData.progression,100);
        });
    });
});