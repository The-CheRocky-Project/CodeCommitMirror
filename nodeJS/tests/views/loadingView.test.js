const view = require('../../src/views/loadingView');
const assert = require('assert');

let mockRes = {
    viewName: "",
    viewData: {},
    render: function(viewName, viewData) {
        this.viewName = viewName;
        this.viewData = viewData;
    }
};

describe('loadingView', () => {
    describe('print()', () => {
        it("should render the loadingTemplate", () =>{
            view.print(mockRes);
            assert.equal(mockRes.viewName,"layouts/loadingTemplate");
        });
    });
});