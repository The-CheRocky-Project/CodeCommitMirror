const assert = require('assert');
const snsWrap=require('../../src/wrappers/snsWrapper');
var AWS = require('aws-sdk-mock');

describe('testSnsWrapper',() => {

    before(() => {
      let topic = 'myTopic';
      let region = 'us-east-2';
      let userCode = 'myCode';
      let arn = snsWrap.getTopicArn(topic, region, userCode);
      let topicPub = new snsWrap.TopicPublisher(topic, region, userCode);
      AWS.mock('SNS', 'publish', 'test-method');
      let msg = 'message';
      let data = 'data';
      let dataFormat = 'dataFormat';
    });

    it("testGetTopicARN", () => {
      let expectedARN="arn:aws:sns:"+this.region+":"+this.userCode+":"+this.topic;
      let arn = snsWrap.getTopicArn(this.topic, this.region, this.userCode);
      assert.equal(arn, expectedARN);
    });

    it("testEsitoPositivoRichiestaInvioMessaggio", () => {
      let expectedResponse = true;
      var response = this.topicPub.sendMessage(this.msg, this.data, this.dataFormat);
      assert.equal(response, expectedResponse);
    });

    after(() => {
      AWS.restore('SNS', 'publish');
    });
});