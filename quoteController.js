import { 
  createQuote as _createQuote,
  getQuote as _getQuote,
  getQuotes as _getQuotes,
  updateQuote as _updateQuote,
  deleteQuote as _deleteQuote,
} from './quoteRepo.js';

// CRUD
export const createQuote = (req, res) => {
  const { text, author } = req.body;

  if (!text) {
    return res.status(400).json({ message: 'Missing quote text.' });
  }
  if (!author) {
    return res.status(400).json({ message: 'Missing quote author.' });
  }

  try {
    const createdQuote = _createQuote(text, author);
    return res.status(201).json(createdQuote);
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getQuotes = (_, res) => {
  const quotes = _getQuotes();
  return res.status(200).json(quotes);
};

export const getQuote = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing quote ID.' });
  }

  const quote = _getQuote(id);
  if (quote) {
    return res.status(200).json(quote);
  } else {
    return res.status(400).json({ message: `Quote with ID ${id} does not exist.` });
  }
};

export const updateQuote = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing quote ID.' });
  }

  const { text } = req.body;
  if (!text) {
    return res.status(400).json({ message: 'Missing quote text.' });
  }

  try {
    const updatedQuote = _updateQuote(id, text);
    return res.status(200).json(updatedQuote);
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const deleteQuote = (req, res) => {
  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing quote ID.' });
  }

  try {
    _deleteQuote(id);
    return res.status(200).json({ id });
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
