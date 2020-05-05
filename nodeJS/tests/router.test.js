// const router = require('../src/nodeJS/router.js')
const request = require('supertest');
const rewire = require('rewire');
const express = require('express');
var routerRew = rewire('../src/router.js');


const ahl = routerRew.__get__('ahl');


describe('Test su endpoint router', function() {
  it('Get to index /', function(done) {

    request(ahl)
      .get('/')
      .expect(200)
      .end(done);

  });

  it('Go to file explorer with get', function(done) {

    request(ahl)
      .get('/toFileExplorer')
      .expect(200)
      .end(done);

  });

  it('Go toLoading with get', function(done) {

    request(ahl)
      .get('/toLoading')
      .expect(200)
      .end(done);

  });

  it('Go toEdit explorer with get', function(done) {

    request(ahl)
      .get('/toEdit')
      .expect(200)
      .end(done);

  });

  // it('Select file with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/selectFile')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('Notify label row changed with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/notifyLabelRowChange')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('Include label with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/includeLabel')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('Get video frame with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/getVideoFrame')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('Add Label with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/addLabel')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('Set video mode with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/setVideoMode')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('notify Editing Finish with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/notifyEditingFinish')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('notifyChangedFileList with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/notifyChangedFileList')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('confirmEdit with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/confirmEdit')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('notifyProgressionUpdate with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/notifyProgressionUpdate')
  //     .send('50')
  //     .set('Accept', 'application/json')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('getFileList with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/getFileList')
  //     .expect(200)
  //     .end(done);
  //
  // });
  //
  // it('notifyNewVideoEndpoint with POST', function(done) {
  //
  //   request(ahl)
  //     .post('/notifyNewVideoEndpoint')
  //     .send({done: '100'})
  //     .set('Accept', 'application/json')
  //     .expect(200)
  //     .end(done);
  //
  // });
});
