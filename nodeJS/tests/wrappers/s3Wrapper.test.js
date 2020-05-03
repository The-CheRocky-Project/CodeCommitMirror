const assert = require('assert');
let s3Wrap = require('../../src/wrappers/s3Wrapper');

describe('testS3Wrapper', function() {

    describe('#getObjectUrl()', () => {
        it("should get the correct object url", () =>{
            let fileKey = "fileKeyDiProva";
            let bucket = "bucketDiProva";
            let region = "regioneDiProva"
            let url = s3Wrap.getObjectUrl(fileKey,bucket,region);
            assert.equal(url,"https://"+bucket+".s3."+region+".amazonaws.com/"+fileKey);
        });
    });
});