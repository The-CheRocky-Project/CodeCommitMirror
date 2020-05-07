const assert = require('assert');
const snsWrap=require('../../src/wrappers/snsWrapper');
var AWSMock = require('aws-sdk-mock');
var rewire = require("rewire");
var snsRewire = rewire("../../src/wrappers/snsWrapper.js");

describe('testSnsWrapper',() => {

  beforeEach(() => {
    let topic = 'myTopic';
    let region = 'us-east-2';
    let userCode = 'myCode';
  });

  describe('#getTopicArn()', () => {

    it("deve restituire l'ARN correttamente calcolato di un topic", () => {
      let expectedARN="arn:aws:sns:"+this.region+":"+this.userCode+":"+this.topic;
      let arn = snsWrap.getTopicArn(this.topic, this.region, this.userCode);
      assert.strictEqual(arn, expectedARN);
    });
  });

  describe('#publisher()', ()=> {

    it("effettuazione della pubblicazione di un messaggio con esito positivo", () => {
      let params = { Message: JSON.stringify({ data: 'Message to send'})};
      var publisher= snsRewire.__get__("publisher");
      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback(null, 'success'); // Mocked response returns ‘success’ always
      });
      var expectedValue=true;
      var result= publisher(params).then((data) => {
          assert.equal(data,expectedValue);
      }).catch((err) => {console.log(err.message);});

    });

    it("la pubblicazione di un messaggio da esito negativo", () => {
      let params = { Message: JSON.stringify({ data: 'Message to send'})};
      var publisher= snsRewire.__get__("publisher"); //importa la funzione privata "publisher"
      AWSMock.mock('SNS', 'publish', (params, callback) => {
        callback('err', null); // Mocked response returns error always
      });
      var expectedValue=false;
      var result= publisher(params).then((data) => {
          assert.equal(result,expectedValue);
      }).catch((err) => {console.log(err.message);});

    });

    afterEach(()=>{
      AWSMock.restore('SNS', 'publish');
    });
  });
/*
  describe('#sendMessage()', ()=> {
    it("l'oggetto TopicPublisher deve pubblicare un messaggio con esito positivo", () => {
      let topic_publisher= new snsWrap.TopicPublisher(this.topic, this.userCode, this.region);
      
    });
  });*/
});
