

//Require the dev-dependencies
let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
const http = require('http');

const app = require('../../app');
const port = parseInt(process.env.PORT, 10) || 8000;
app.set('port', port);

const server = http.createServer(app);
server.listen(port);
var request = require("supertest").agent(server);
chai.use(chaiHttp);

/*
  * Test the /GET route
  */
describe('/GET book', () => {
  after(function (done) {
        server.close();
        done();
    });

  it('it should GET all the books', (done) => {
    request
      .get('/api')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.message.should.be.eql('Welcome to the Todos API!');
        done();
      });
  });

  it('it should not POST a book without pages field', (done) => {
    let title = {"title" :"lovely God"};
    request
      .post('/api/todos')
      .send(title)
      .end((err, res) => {
        if(err){
          res.body.errors.should.have.property('updatedAt');
          res.body.errors.pages.should.have.property('title').eql('lovely God');
        } else {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('title');
        }
        done();
      });
  });

});

