let view = require('../../src/views/fileExplorerView');
let assert = require('assert');

describe('fileExplorerView', function() {
    describe('print()', function () {
        let fileList;
        let mockReq = null;
        let mockRes;
        context('with argument', function () {
            it('body should contain the given fileKeys and Urls', function () {
                fileList = {
                    files: [{fileKey: 'titoloProva', thumbnailUrl: 'urlThumbnail'}, {fileKey: 'PartitaDiCalcio', thumbnailUrl: 'urlImmagine'}]
                };
                mockRes = {
                    render: function (pageName, body) {
                        assert.ok(body.tiles.includes("titoloProva"));
                        assert.ok(body.tiles.includes("urlThumbnail"));
                        assert.ok(body.tiles.includes("PartitaDiCalcio"));
                        assert.ok(body.tiles.includes("urlImmagine"));
                    }
                };
                view.print(mockReq, mockRes, fileList);
            })
        });

        context('with empty argument', function () {
            it('body should contain warning: No files found', function () {
                fileList = {files: []};
                mockRes = {
                    render: function (pageName, body) {
                        assert.ok(body.tiles.includes("<p>Non sono presenti video.</p>"));
                    }
                };
                view.print(mockReq, mockRes, fileList);
            })
        });
    });
});