import chai from 'chai';
import chaiHttp from 'chai-http';
import UserModel from '../userModel.js';

import { app } from './../index.js';

//Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Quotes API', () => {
  const testUser = {
    username: 'Test user 4',
    role: 'admin',
  };
  let accessToken;

  before(done => {
    chai.request(app)
      .post('/api/users')
      .send(testUser)
      .end((_, res) => {
        res.should.have.status(201);
        done();
      });
  });
  before(done => {
    chai.request(app)
      .post('/login')
      .send({ username: testUser.username })
      .end((_, res) => {
        accessToken = res.body.accessToken;
        res.should.have.status(200);
        done();
      });
  });
  after(done => {
    UserModel.deleteMany({}, () => {
      done();
    });
  });

  describe('POST /api/quotes', () => {
    it('should POST a new quote', (done) => {
      const quote = {
        text: 'Test quote 4.',
        author: testUser.username,
      };
      chai.request(app)
        .post('/api/quotes')
        .set('authorization', `Bearer ${accessToken}`)
        .send(quote)
        .end((_, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(3);
          res.body.should.have.property('text').eq('Test quote 4.');
          res.body.should.have.property('author').eq(testUser.username);
          done();
        });
    });

    it('should NOT POST a new quote without the text property', (done) => {
      const quote = {};
      chai.request(app)
        .post('/api/quotes')
        .set('authorization', `Bearer ${accessToken}`)
        .send(quote)
        .end((_, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Missing quote text.');
          done();
        });
    });

    it('should NOT POST a new quote without the author property', (done) => {
      const quote = {
        text: 'Test quote 2.',
      };
      chai.request(app)
        .post('/api/quotes')
        .set('authorization', `Bearer ${accessToken}`)
        .send(quote)
        .end((_, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Missing quote author.');
          done();
        });
    });
  });

  describe('GET /api/quotes', () => {
    it('should GET all the quotes', (done) => {
      chai.request(app)
        .get('/api/quotes')
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eq(4);
          done();
        });
    });
  });

  describe('GET /api/quotes/:id', () => {
    it('should GET a quote by ID', (done) => {
      const quoteId = 0;
      chai.request(app)
        .get('/api/quotes/' + quoteId)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(0);
          res.body.should.have.property('text').eq('Test quote 1.');
          res.body.should.have.property('author').eq('Author 1');
          done();
        });
    });

    it('should NOT GET a quote by ID', (done) => {
      const quoteId = 123;
      chai.request(app)
        .get('/api/quotes/' + quoteId)
        .end((_, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq(`Quote with ID ${quoteId} does not exist.`);
          done();
        });
    });
  });

  describe('PUT /api/quotes/:id', () => {
    it('should PUT an existing quote', (done) => {
      const quoteId = 2;
      const quote = {
        text: 'Test quote 3 updated.',
      };
      chai.request(app)
        .put('/api/quotes/' + quoteId)
        .set('authorization', `Bearer ${accessToken}`)
        .send(quote)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(2);
          res.body.should.have.property('text').eq('Test quote 3 updated.');
          res.body.should.have.property('author').eq('Author 3');
          done();
        });
    });

    it('should NOT PUT an existing quote with an empty text', (done) => {
      const quoteId = 2;
      const quote = {
        text: '',
      };
      chai.request(app)
        .put('/api/quotes/' + quoteId)
        .set('authorization', `Bearer ${accessToken}`)
        .send(quote)
        .end((_, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Missing quote text.');
          done();
        });
    });
  });

  describe('DELETE /api/quotes/:id', () => {
    it('should DELETE an existing quote', (done) => {
      const quoteId = 1;
      chai.request(app)
        .delete('/api/quotes/' + quoteId)
        .set('authorization', `Bearer ${accessToken}`)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq('1');
          done();
        });
    });

    it('should NOT throw an exception if a quote does not exist', (done) => {
      const quoteId = 145;
      chai.request(app)
        .delete('/api/quotes/' + quoteId)
        .set('authorization', `Bearer ${accessToken}`)
        .end((_, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq('145');
          done();
        });
    });
  });
});
