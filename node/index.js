import 'dotenv/config';
import http from 'http';
import url from 'url';

import { getQuotes, createQuote, updateQuote, deleteQuote, handleOptions, notFound } from './controller.js';

// Server initialization
export const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'content-type');

  const urlparse = url.parse(req.url, true);

  if (urlparse.pathname === '/api/quotes' && req.method === 'GET') {
    getQuotes(req, res);
  } else if (urlparse.pathname === '/api/quotes' && req.method === 'POST') {
    createQuote(req, res);
  } else if (urlparse.pathname === '/api/quotes' && req.method === 'PUT') {
    updateQuote(req, res);
  } else if (urlparse.pathname === '/api/quotes' && req.method === 'DELETE') {
    deleteQuote(req, res);
  } else if (urlparse.pathname === '/api/quotes' && req.method === 'OPTIONS') {
    handleOptions(req, res);
  } else {
    notFound(req, res);
  }
});

const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
