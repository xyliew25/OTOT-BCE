import chai from 'chai';
import chaiHttp from 'chai-http';

import { server } from './../index.js';

//Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Quotes API', () => {

  describe('POST /api/quotes', () => {
    it('should POST a new quote', (done) => {
      const quote = {
        text: 'Test quote 4.',
      };
      chai.request(server)
        .post('/api/quotes')
        .send(quote)
        .end((err, res) => {
          res.should.have.status(201);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(3);
          res.body.should.have.property('text').eq('Test quote 4.');
          res.body.should.have.property('author').eq('Anonymous');
          done();
        });
    });

    it('should NOT POST a new quote without the text property', (done) => {
      const quote = {};
      chai.request(server)
        .post('/api/quotes')
        .send(quote)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Missing quote text.');
          done();
        });
    });
  });

  describe('GET /api/quotes', () => {
    it('should GET all the quotes', (done) => {
      chai.request(server)
        .get('/api/quotes')
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('array');
          res.body.length.should.be.eq(4);
          done();
        });
    });

    it('should NOT GET all the quotes', (done) => {
      chai.request(server)
        .get('/api/quote')
        .end((err, res) => {
          res.should.have.status(404);
          done();
        });
    });
  });

  describe('GET /api/quotes?id=', () => {
    it('should GET a quote by ID', (done) => {
      const quoteId = 0;
      chai.request(server)
        .get('/api/quotes?id=' + quoteId)
        .end((err, res) => {
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
      chai.request(server)
        .get('/api/quotes?id=' + quoteId)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq(`Quote with ID ${quoteId} does not exist.`);
          done();
        });
    });
  });

  describe('PUT /api/quotes?id=', () => {
    it('should PUT an existing quote', (done) => {
      const quoteId = 2;
      const quote = {
        text: 'Test quote 3 updated.',
        author: 'Author 3',
      };
      chai.request(server)
        .put('/api/quotes?id=' + quoteId)
        .send(quote)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a('object');
          res.body.should.have.property('id').eq(2);
          res.body.should.have.property('text').eq('Test quote 3 updated.');
          res.body.should.have.property('author').eq('Author 3');
          done();
        });
    });

    it('should NOT PUT an existing quote with an empty text', (done) => {
      const quoteId = 1;
      const quote = {
        text: '',
      };
      chai.request(server)
        .put('/api/quotes?id=' + quoteId)
        .send(quote)
        .end((err, res) => {
          res.should.have.status(400);
          res.body.should.have.property('message').eq('Missing quote text.');
          done();
        });
    });
  });

  describe('DELETE /api/quotes?id=', () => {
    it('should DELETE an existing quote', (done) => {
      const quoteId = 1;
      chai.request(server)
        .delete('/api/quotes?id=' + quoteId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eq(`Successfully deleted quote with ID ${quoteId}.`);
          done();
        });
    });

    it('should NOT throw an exception if a quote does not exist', (done) => {
      const quoteId = 145;
      chai.request(server)
        .delete('/api/quotes?id=' + quoteId)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.have.property('message').eq(`Successfully deleted quote with ID ${quoteId}.`);
          done();
        });
    });
  });
});
