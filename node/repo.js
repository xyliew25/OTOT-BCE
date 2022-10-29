import 'dotenv/config';

import { initFile, readFile, resetFile, writeFile } from './fileHelper.js';

export const sampleQuotes = [
  {
    id: 0,
    text: 'You say your life is hard, but whose not?',
    author: 'xyliew'
  },
  {
    id: 1,
    text: 'Be very grateful if you have a loving and supportive family, because not everyone does.',
    author: 'xyliew'
  },
  {
    id: 2,
    text: 'You gotta take hold of your life, because if you don\'t care, nobody else would.',
    author: 'xyliew'
  }
];

export const testQuotes = [
  {
    id: 0,
    text: 'Test quote 1.',
    author: 'Author 1'
  },
  {
    id: 1,
    text: 'Test quote 2.',
    author: 'Author 2'
  },
  {
    id: 2,
    text: 'Test quote 3.',
    author: 'Anonymous'
  }
];

// Database initialization
let dbPath;
if (process.env.ENV == 'DEV') {
  dbPath = process.env.DB_PATH;
  initFile(dbPath, sampleQuotes);
} else if (process.env.ENV == 'TEST') {
  dbPath = process.env.TEST_DB_PATH;
  resetFile(dbPath, testQuotes);
}
const rawQuotes = readFile(dbPath);
export let quotes = JSON.parse(rawQuotes);
export let lastindex = quotes.length === 0 ? -1 : quotes[quotes.length - 1].id;

// CRUD
export const createQuote = (newQuote) => {
  const { text, author } = newQuote; 
  const quote = {
    id: ++lastindex, 
    text, 
    author: author ? author : 'Anonymous',
  };
  quotes.push(quote);
  writeFile(dbPath, quotes);
  return quote;
} 

export const getQuotes = () => {
  return quotes;
}

export const getQuote = (id) => {
  const quote = quotes.filter(quote => quote.id == id);
  return quote.length > 0 ? quote[0] : null;
}

export const updateQuote = (id, data) => {
  const { text, author } = data;
  let updatedQuote;
  quotes.forEach((quote, index) => {
    if (quote.id == id) {
      quotes[index].text = text ? text : quotes[index].text;
      quotes[index].author = author ? author : quotes[index].author;
      updatedQuote = quote;
    }
  });
  writeFile(dbPath, quotes);
  return updatedQuote;
}

export const deleteQuote = (id) => {
  quotes = quotes.filter(quote => quote.id != id);
  writeFile(dbPath, quotes);
}
