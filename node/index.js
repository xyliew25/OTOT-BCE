import 'dotenv/config';
import express from 'express';
import cors from 'cors';

import { getUsers, getUser, createUser, deleteUser } from './userController.js';
import { getQuotes, getQuote, createQuote, updateQuote, deleteQuote } from './quoteController.js';
import { login, authenticate, authorize } from './auth.js';

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.options('*', cors());

// Users
app.get('/api/users', getUsers);
app.get('/api/users/:id', getUser);
app.post('/api/users', createUser);
app.delete('/api/users/:id', deleteUser);
app.post('/login', login);

// Quotes
app.get('/api/quotes', getQuotes);
app.get('/api/quotes/:id', getQuote);
app.post('/api/quotes', authenticate, createQuote);
app.put('/api/quotes/:id', authenticate, authorize, updateQuote);
app.delete('/api/quotes/:id', authenticate, authorize, deleteQuote);

app.get('*', (_, res) => {
  res.status(404).json({ message: 'This page does not exist.' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}.`);
});
