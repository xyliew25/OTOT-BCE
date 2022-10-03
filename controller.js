import url from 'url';
// TODO: querystring is deprecated
import querystring from 'querystring';

import { 
  createQuote as _createQuote,
  getQuote as _getQuote,
  getQuotes as _getQuotes,
  updateQuote as _updateQuote,
  deleteQuote as _deleteQuote,
} from './repo.js';

const sendResponse = (res, status, data) => {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data, null, 2));
};

export const getQuotes = (req, res) => {
  const urlparse = url.parse(req.url, true);
  const search = urlparse.search;

  if (search) {
    const [, query] = urlparse.search.split('?');
    const data = querystring.parse(query);

    const quote = _getQuote(data.id);
    if (quote) {
      sendResponse(res, 200, quote);
    } else {
      sendResponse(res, 400, { message: `Quote with ID ${data.id} does not exist.` });
    }
  } else {
    const quotes = _getQuotes();
    sendResponse(res, 200, quotes);
  }
};

export const createQuote = (req, res) => {
  req.on('data', data => {
    const dataJson = JSON.parse(data);
    const text = dataJson.text;

    if (!text) {
      sendResponse(res, 400, { message: 'Missing quote text.' });
    } else {
      try {
        const createdQuote = _createQuote(dataJson);
        sendResponse(res, 201, createdQuote);
      } catch (e) {
        sendResponse(res, 500, { message: 'Internal server error.' });
      }
    }
  });
};

export const updateQuote = (req, res) => {
  const urlparse = url.parse(req.url, true);

  req.on('data', data => {
    const search = urlparse.search;

    if (search) {
      const [, query] = urlparse.search.split('?');
      const id = querystring.parse(query).id;

      if (id) {
        const dataJson = JSON.parse(data);
        const text = dataJson.text;

        if (!text) {
          sendResponse(res, 400, { message: 'Missing quote text.' });
        } else {
          try {
            const updatedQuote = _updateQuote(id, dataJson);
            sendResponse(res, 200, updatedQuote);
          } catch (e) {
            sendResponse(res, 500, { message: 'Internal server error.' });
          }
        }
      } else {
        sendResponse(res, 400, { message: 'Missing quote ID.' });
      }
    } else {
      sendResponse(res, 400, { message: 'Missing quote ID.' });
    }
  });
};

export const deleteQuote = (req, res) => {
  const urlparse = url.parse(req.url, true);
  const search = urlparse.search;

  if (search) {
    const [, query] = urlparse.search.split('?');
    const data = querystring.parse(query);

    try {
      _deleteQuote(data.id);
      sendResponse(res, 200, { message: `Successfully deleted quote with ID ${data.id}.` });
    } catch (e) {
      sendResponse(res, 500, { message: 'Internal server error.' });
    }
  } else {
    sendResponse(res, 400, { message: 'Missing quote ID.' });
  }
};

export const notFound = (_, res) => {
  sendResponse(res, 404, { message: 'This page does not exist.' });
};
