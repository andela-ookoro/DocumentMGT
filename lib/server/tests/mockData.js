'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _faker = require('faker');

var _faker2 = _interopRequireDefault(_faker);

var _jest = require('jest');

var _jest2 = _interopRequireDefault(_jest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var mockData = {
  role: {
    title: _faker2.default.lorem.words(2),
    status: 'enable',
    description: _faker2.default.lorem.sentences()
  },
  roleWithoutTitle: {
    title: '',
    status: 'enable',
    description: _faker2.default.lorem.sentences()
  },
  updateRole: {
    title: _faker2.default.lorem.words(2),
    status: 'enable',
    description: _faker2.default.lorem.sentences()
  },
  accessRight: {
    title: _faker2.default.lorem.words(2),
    status: 'enable',
    description: _faker2.default.lorem.sentences()
  },
  user: {
    fname: _faker2.default.name.firstName(),
    lname: _faker2.default.name.lastName(),
    mname: _faker2.default.name.firstName(),
    password: '!smilesh2o',
    email: _faker2.default.internet.email(),
    roleId: 3
  },
  regularUser: {
    id: 3,
    name: 'Dele Musa Chimdi',
    status: 'active',
    email: _faker2.default.internet.email(),
    role: 'D1 fellow',
    title: 'D1 Fellow',
    fname: 'Dele',
    lname: 'Musa',
    mname: 'Chimdi',
    createdAt: new Date().toDateString(),
    doccount: '1'
  },
  updateuser: {
    fname: _faker2.default.name.firstName(),
    lname: _faker2.default.name.lastName(),
    mname: _faker2.default.name.firstName(),
    password: _faker2.default.name.lastName(),
    email: _faker2.default.internet.email(),
    roleId: 3
  },
  UserWithoutFirstname: {
    fname: null,
    lname: _faker2.default.name.lastName(),
    mname: _faker2.default.name.firstName(),
    password: _faker2.default.name.lastName(),
    email: _faker2.default.internet.email(),
    roleId: 3
  },
  UserWithoutlastname: {
    fname: _faker2.default.name.lastName(),
    lname: null,
    mname: _faker2.default.name.firstName(),
    password: _faker2.default.name.lastName(),
    email: _faker2.default.internet.email(),
    roleId: 3
  },
  UserWithoutPassword: {
    fname: _faker2.default.name.lastName(),
    lname: _faker2.default.name.lastName(),
    mname: _faker2.default.name.firstName(),
    password: null,
    email: _faker2.default.internet.email(),
    roleId: 3
  },
  UserWithoutEmail: {
    fname: _faker2.default.name.lastName(),
    lname: _faker2.default.name.lastName(),
    mname: _faker2.default.name.firstName(),
    password: _faker2.default.name.lastName(),
    email: '',
    roleId: 3
  },
  UserWithInvalidEmail: {
    fname: _faker2.default.name.lastName(),
    lname: _faker2.default.name.lastName(),
    mname: _faker2.default.name.firstName(),
    password: _faker2.default.name.lastName(),
    email: _faker2.default.name.lastName(),
    roleId: 3
  },
  UserWithInvalidName: {
    fname: _faker2.default.name.lastName(2),
    lname: _faker2.default.name.lastName(2),
    mname: _faker2.default.name.firstName(),
    password: _faker2.default.name.lastName(),
    email: _faker2.default.name.lastName(),
    roleId: 3
  },
  document: {
    title: _faker2.default.lorem.words(2),
    synopsis: _faker2.default.lorem.sentences(4),
    body: _faker2.default.lorem.sentences(4),
    owner: 4,
    accessRight: 'private',
    role: 1,
    author: 'cele'
  },
  updatedocument: {
    title: _faker2.default.lorem.words(2),
    synopsis: _faker2.default.lorem.sentences(),
    body: _faker2.default.lorem.sentences(),
    owner: 4,
    accessRight: 'role'
  },
  DocumentWithoutTitle: {
    title: null,
    synopsis: _faker2.default.lorem.sentences(),
    body: _faker2.default.lorem.sentences(),
    owner: 1,
    accessRight: 1
  },
  DocumentWithoutBody: {
    title: _faker2.default.lorem.words(2),
    synopsis: _faker2.default.lorem.sentences(),
    body: null,
    owner: 1,
    accessRight: 1
  },
  DocumentWithInvalidTitleBody: {
    title: _faker2.default.name.lastName(2),
    synopsis: _faker2.default.lorem.sentences(),
    body: _faker2.default.name.lastName(2),
    owner: 1,
    accessRight: 1
  },
  errorMessage: 'error occurred',
  message: _faker2.default.lorem.sentences()
};

exports.default = mockData;