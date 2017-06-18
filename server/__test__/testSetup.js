import expect from 'expect';
import supertest from 'supertest'
import model from '../../models';
import mockData from './mockdata';

import app from '../../../server';


//Require the dev-dependencie
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

const request = supertest.agent(app);
chai.use(chaiHttp)



//import mockdata
let document =  mockdata.document;
let registeredDocument = {};
let user =  mockdata.user;
let registeredUser = {};