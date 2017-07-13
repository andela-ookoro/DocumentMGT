import expect from 'expect';
import supertest from 'supertest';
import model from '../../models';
import mockData from './mockdata';

import app from '../../../server';


// Require the dev-dependencie
const chai = require('chai');
const chaiHttp = require('chai-http');
const should = chai.should();

const request = supertest.agent(app);
chai.use(chaiHttp);


// import mockdata
const document = mockdata.document;
const registeredDocument = {};
const user = mockdata.user;
const registeredUser = {};
