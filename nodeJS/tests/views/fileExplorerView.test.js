const view = require('../../src/views/fileExplorerView');
const assert = require('assert');

let param = {};
let mockRes = {
    viewName: "",
    viewData: {},
    render: function(viewName, viewData) {
        this.viewName = viewName;
        this.viewData = viewData;
    }
};

describe('fileExplorerView', () => {
    describe('print()', () => {
        it("should render the fileExplorerTemplate", () =>{
           view.print(param,mockRes);
           assert.equal(mockRes.viewName,"layouts/fileExplorerTemplate");
        });
    });
});