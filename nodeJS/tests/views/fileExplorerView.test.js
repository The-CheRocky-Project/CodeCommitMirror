let view = require('../../src/views/fileExplorerView');
let assert = require('assert');

let mockReq = {};
let mockRes = {
    viewName: "",
    viewData: {},
    render: function(viewName, viewData) {
        this.viewName = viewName;
        this.viewData = viewData;
    }
};
let fileList = {};

describe('fileExplorerView', () => {
    describe('print()', () => {
        it("should render the fileExplorerTemplate", () =>{
           view.print(mockReq,mockRes,fileList);
           assert.equal(mockRes.viewName,"layouts/fileExplorerTemplate");
        });
    });
});