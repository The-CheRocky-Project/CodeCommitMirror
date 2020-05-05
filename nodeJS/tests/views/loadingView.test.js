const view = require('../../src/views/loadingView');
const assert = require('assert');

describe('testLoadingView', () => {
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
    describe('#print()', () => {
        it("should render the loadingTemplate", () =>{
            view.print(mockRes);
            assert.strictEqual(mockRes.viewName,"layouts/loadingTemplate");
        });
    });
    describe('#generateProgressBar()', () => {
        it("should render the progress bar with the correct progression", () =>{
            let progress = 100;
            view.generateProgressBar(mockRes,progress);
            assert.strictEqual(mockRes.viewName,"partials/progressBar");
            assert.strictEqual(mockRes.viewData.progression,100);
        });
    });
});