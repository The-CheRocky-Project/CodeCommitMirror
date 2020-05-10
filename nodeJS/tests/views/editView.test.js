const assert = require('assert');
const view = require('../../src/views/editView');

const res = '';

describe('testEditView', () => {
    describe('#print()', () => {

        let mockRes;

        before(function() {

            mockRes = {
                viewName: "",
                viewData: {},
                render: function(viewName, viewData) {
                    this.viewName = viewName;
                    this.viewData = viewData;
                }
            };

        });
        it("Deve printare layouts/editTemplate", () =>{

            let param = {};
            view.print(param, mockRes);
            assert.strictEqual(mockRes.viewName, "layouts/editTemplate");
            assert.ok(mockRes.viewData.layout);

        });
    });
    //ASPETTARE A FARE IL TEST CHE SI CORREGGA LA params dentro questo metodo che non esiste
    // describe('#generateVideoFrame(url, isOriginal, mockRes)', () => {

    //     let mockRes;

    //     before(function() {

    //         mockRes = {
    //             viewName: "",
    //             viewData: {},
    //             render: function(viewName, viewData) {
    //                 this.viewName = viewName;
    //                 this.viewData = viewData;
    //             }
    //         };

    //     });
    //     it("Deve printare partials/videoFrame", () =>{

    //         let url = '';
    //         let isOriginal = {};
    //         view.generateVideoFrame(url, isOriginal, mockRes);
    //         assert.strictEqual(mockRes.viewName,"partials/videoFrame");
    //         assert.ok(!mockRes.viewData.layout);

    //     });
    // });

    describe('#generateTable(params, res)', () => {

        let mockRes;

        before(function() {

            mockRes = {
                viewName: "",
                viewData: {},
                render: function(viewName, viewData) {
                    this.viewName = viewName;
                    this.viewData = viewData;
                }
            };

        });

        it("Deve printare partials/tableTemplate", () =>{

            let params = {};
            view.generateTable(params, mockRes);
            assert.strictEqual(mockRes.viewName, "partials/tableTemplate");
            assert.ok(!mockRes.viewData.layout);

        });
    });

});
