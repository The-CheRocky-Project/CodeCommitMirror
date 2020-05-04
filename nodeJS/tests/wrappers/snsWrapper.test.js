const assert = require('assert');
const snsWrap=require('../../src/wrappers/snsWrapper');
var AWS = require('aws-sdk-mock');

describe('testSnsWrapper',() => {
  describe('#getTopicArn()', () => {
    before(() => {
      let topic = 'myTopic';
      let region = 'us-east-2';
      let userCode = 'myCode';
    });

    it("deve restituire l'ARN correttamente calcolato di un topic", () => {
      let expectedARN="arn:aws:sns:"+this.region+":"+this.userCode+":"+this.topic;
      let arn = snsWrap.getTopicArn(this.topic, this.region, this.userCode);
      assert.strictEqual(arn, expectedARN);
    });
  });
  describe('#sendMessage()', ()=> {
    before(() => {
      var msg= {
        Message: "message",
        MessageAttributes: {
            'data': {
                DataType: "dataFormat",
                BinaryValue: Buffer.from("data")
            }
        },
        TopicArn: this.arn
      };
      AWS.mock('SNS', 'publish', (params, callback) => {
        callback(undefined, 'success'); // Mocked response returns ‘success’ always
      });
    });
    it("deve effettuare la pubblicazione di un messaggio con esito positivo", () => {
      var expectedValue=true;
      var result= snsWrap.publisher(this.msg);
      assert.strictEqual(result,expectedValue);
      
    });
    after(() => {
      AWS.restore('SNS', 'publish');
    });
    /*it("testEsitoPositivoRichiestaInvioMessaggio", () => {
      var expectedResult=true;
      //var topicPub = new snsWrap.TopicPublisher(this.topic, this.region, this.userCode);
      //var result= topicPub.sendMessage(this.msg, this.data, this.dataFormat);
      var param= publisher({
        Message: "message",
        MessageAttributes: {
            'data': {
                DataType: "dataFormat",
                BinaryValue: Buffer.from("data")
            }
        },
        TopicArn: this.arn
      });
      AWS.mock('SNS', 'publish', 'test-method');
      var result= snsWrap.publisher(param);
      AWS.restore('SNS', 'publish');
      assert.strictEqual(expectedResult, result);
    });*/
  });
});