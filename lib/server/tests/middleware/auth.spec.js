// import chai from 'chai';
// import sinon from 'sinon';
// import jwt from 'jsonwebtoken';
// import middlewares from '../../controllers/helpers/utilities';
// import mockData from '../mockData';

// // const request = supertest.agent(app);
// const expect = chai.expect;
// // create reference to validateUser function
// const auth = middlewares.validateUser;


// describe('Test Auth Middleware', () => {
//   // create request, response and next object
//   let request;
//   let response;
//   let next;

//   beforeEach(() => {
//     request = {};
//     response = {
//       status: sinon.stub().returnsThis(),
//       send: sinon.spy()
//     };
//     next = sinon.spy();
//   });

//   const fakeToken = 'fake token';

//   it('next should not be called if no token provided', () => {
//     auth(request, response, next);
//     expect(next.called).to.equal(false);
//   });

//   it('should return 401 status code if no token provided', () => {
//     auth(request, response, next);
//     expect(response.status.getCall(0).args[0]).to.equal(401);
//   });

//   it('next should not be called if bad token was provided', () => {
//     request.headers = {};
//     request.headers.authorization = fakeToken;
//     auth(request, response, next);
//     expect(next.called).to.equal(false);
//   });

//   it('should return 401 status code if bad token was provided', () => {
//     request.headers = {};
//     request.headers.authorization = fakeToken;
//     auth(request, response, next);
//     expect(response.status.getCall(0).args[0]).to.equal(401);
//   });

//   it('request should contain user info if good token was provided', () => {
//     request.headers = {};
//     request.user = '';
//     request.headers.authorization = jwt
//     .sign(mockData.user, process.env.TOKENSECRET);
//     auth(request, response, next);
//     expect(request).to.have.property('user');
//   });

//   it('next should be called once if good token was provided', () => {
//     request.headers = {};
//     request.headers.authorization = jwt
//     .sign(mockData.user, process.env.TOKENSECRET);
//     auth(request, response, next);
//     expect(next.calledOnce).to.equal(true);
//   });
// });
"use strict";