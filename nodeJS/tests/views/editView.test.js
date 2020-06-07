const assert = require('assert');
const view = require('../../src/views/editView');

const res = '';

describe('testEditView', () => {
    //TODO correggere test
    // describe('#print()', () => {

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

    //     it("Deve printare layouts/editTemplate", () =>{
    //         object=[]
    //         const val = JSON.stringify({
    //             url: "videoEndpoint",
    //             originalVideo: true,
    //             error: false,
    //             list: [object],
    //             labels: {
    //                 labels:[
    //                     'prima_label',
    //                     'seconda_label'
    //                 ]
    //             }
    //         });
    //         var params=JSON.parse(val);
    //         view.print(params, mockRes);
            
    //         var ds = [ 'prima_label', 'seconda_label' ];
    //         var labelList = 
    //         var matrix = [labelList];
    //         var trix = [matrix];
    //         var viewDataExpected={
    //             template: 'editTemplate',
    //             data: {
    //                 videoData: { endpoint: 'videoEndpoint', original: true },
    //                 tableData: { 
    //                     error: false, 
    //                     recognizements: trix,
    //                     labels: [
    //                         'prima_label',
    //                         'seconda_label'
    //                     ]
    //                 }
    //             },
    //             layout: 'main'
    //         };
    //         assert.strictEqual("layouts/editTemplate", mockRes.viewName);
    //         assert.strictEqual(viewDataExpected, mockRes.viewData);

    //     });
    // });
    //ASPETTARE A FARE IL TEST CHE SI CORREGGA LA params dentro questo metodo che non esiste
    describe('#generateVideoFrame(url, isOriginal, mockRes)', () => {

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
        it("Deve printare partials/videoFrame", () =>{

            let url = '';
            let isOriginal = {};
            view.generateVideoFrame(url, isOriginal, mockRes);
            assert.strictEqual(mockRes.viewName,"partials/videoFrame");
            assert.ok(!mockRes.viewData.layout);

        });
    });

    /*TODO test errato
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
    });*/

});
