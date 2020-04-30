/**
 * File Explorer Model module.
 * @module models/fileExplorerModel
 */
const s3 = require('../wrappers/s3Wrapper')
const sns = require('../wrappers/snsWrapper')

/**
 * return files from the fileExplorer bucket
 */
exports.listFilekeys = () =>{
    return s3.listObject();
}

/**
 * return thumbnail URL from a bucket
 */
exports.getThumbnailURL = (filekey) =>{
    return s3.getObjectUrl(filekey);
}

/**
 * send a message by snsWrap to serverless application to launch the file elaboration
 * @fileKey URL video to elaborate
 */
exports.processFile = (fileKey) =>{
    return sns.message({
        message: "start process",
        data: fileKey
        }
    );
};