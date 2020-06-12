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
            object=[];
            const val = JSON.stringify({
                url: "videoEndpoint",
                originalVideo: true,
                error: false,
                list: [object],
                labels: {
                    labels:[
                        'prima_label',
                        'seconda_label'
                    ]
                }
            });
            var params=JSON.parse(val);
            view.print(params, mockRes);

            assert.strictEqual("layouts/editTemplate", mockRes.viewName);


        });
    });

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

        it("Deve printare layouts/tableLayout", () =>{


            object=[];
            const val = JSON.stringify({
                url: "videoEndpoint",
                originalVideo: true,
                error: false,
                list: [object],
                labels: {
                    labels:[
                        'prima_label',
                        'seconda_label'
                    ]
                }
            });
            let params=JSON.parse(val);
            view.generateTable(params, mockRes);
            assert.strictEqual(mockRes.viewName, "layouts/tableLayout");
            assert.ok(mockRes.viewData.layout);

        });
    });

});
