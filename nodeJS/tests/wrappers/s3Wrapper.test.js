const assert = require('assert');
const rewire = require("rewire");
let s3Wrap = rewire("../../src/wrappers/s3Wrapper");
//let s3Wrap = require('../../src/wrappers/s3Wrapper');
//const AWS = require('aws-sdk-mock');


describe('testS3Wrapper', function() {

    describe('#getObjectUrl()', () => {
        before(() => {
            let fileKey = "fileKeyDiProva";
            let bucket = "bucketDiProva";
            let region = "regioneDiProva";
        });
        it("should get the correct object url", () =>{
            let url = s3Wrap.getObjectUrl(this.fileKey,this.bucket,this.region);
            assert.strictEqual(url,"https://"+this.bucket+".s3."+this.region+".amazonaws.com/"+this.fileKey);
        });
    });
    describe('#listObjects()', () => {
        it("should list the objects", () =>{
            let bucket = "prova";
            let prefix = "prova";
            let response = {
                Contents: [
                    {Key: "happyface.mp4"},
                    {Key: "test.mp4"}
                ]
            }
            let s3ClientMock = {
                listObjectsV2 : function() {
                    return {
                        promise: function() {
                            return response;
                        }
                    }
                }
            }
            s3Wrap.__set__("s3Client", s3ClientMock);
            let objects = s3Wrap.listObjects(this.bucket,this.prefix);
            objects.then(function (res) {
                assert.deepStrictEqual(res,["happyface.mp4","test.mp4"]);
            })
                .catch(function (err) {
                    assert.fail("Promise error: "+err);
                })
        });
    });
});