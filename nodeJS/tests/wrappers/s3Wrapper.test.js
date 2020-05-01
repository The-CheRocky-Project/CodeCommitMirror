const assert = require('assert');

describe('s3Wrapper', function() {
    let s3Wrap;
    beforeEach(function () {
        s3Wrap = require('../../src/wrappers/s3Wrapper');
    });

    describe('getObjectUrl()', () => {
        it("should get the correct object url", () =>{
            let fileKey = "fileKeyDiProva";
            let url = s3Wrap.getObjectUrl(fileKey);
            assert.equal(url,"https://ahlconsolebucket.s3.us-east-2.amazonaws.com/thumbnails/"+fileKey+".jpg");
        });
        it("should get the correct object url with bucket changed", () =>{
            let newBucket = "bucketDiProva";
            s3Wrap.setBucket(newBucket);
            let fileKey = "fileKeyDiProva";
            let url = s3Wrap.getObjectUrl("fileKeyDiProva");
            assert.equal(url,"https://"+newBucket+".s3.us-east-2.amazonaws.com/thumbnails/"+fileKey+".jpg");
        });
    });
});