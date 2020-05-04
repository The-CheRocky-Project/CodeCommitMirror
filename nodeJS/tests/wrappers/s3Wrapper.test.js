const assert = require('assert');
const rewire = require("rewire");
let s3Wrap = rewire("../../src/wrappers/s3Wrapper");

describe('testS3Wrapper', function() {
    describe('#getObjectUrl()', () => {
        it("should get the correct object url", () =>{
            let fileKey = "fileKeyDiProva";
            let bucket = "bucketDiProva";
            let region = "regioneDiProva";
            let url = s3Wrap.getObjectUrl(fileKey,bucket,region);
            assert.strictEqual(url,"https://"+bucket+".s3."+region+".amazonaws.com/"+fileKey);
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
            let objects = s3Wrap.listObjects(bucket,prefix);
            objects.then(function (res) {
                assert.deepStrictEqual(res,["happyface.mp4","test.mp4"]);
            })
                .catch(function (err) {
                    assert.fail("Promise error: "+err);
                })
        });
    });
    describe('#getJsonFile()', () => {
        it("should get the json content", () =>{
            let bucket = "prova";
            let fileKey = "prova.json";
            let response = {
                Body: '{"campo1":"prova","campo2":"ciao"}'
            }
            let s3ClientMock = {
                getObject : function() {
                    return {
                        promise: function() {
                            return response;
                        }
                    }
                }
            }
            s3Wrap.__set__("s3Client", s3ClientMock);
            let json = s3Wrap.getJsonFile(bucket,fileKey);
            json.then(function (res) {
                expectedRes = {
                    campo1 : "prova",
                    campo2 : "ciao"
                }
                assert.deepStrictEqual(res,expectedRes);
            })
                .catch(function (err) {
                    assert.fail("Promise error: "+err);
                })
        });
    });
});