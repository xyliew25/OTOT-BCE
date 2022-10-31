import 'dotenv/config';
import jwt from 'jsonwebtoken';

import { getUser as _getUser } from './userRepo.js';
import { getQuote as _getQuote } from './quoteRepo.js';

// Roles
const ROLE = {
  ADMIN: 'admin',
  BASIC: 'basic',
};

export const isValidRole = (role) => {
  return Object.values(ROLE).reduce((prev, curr) => prev || curr === role, false);
};

// Permissions
export const isAdmin = (username) => {
  const user = _getUser(username);
  return user && user.role === ROLE.ADMIN;
};

export const isOwn = (username, quoteId) => {
  const quote = _getQuote(quoteId);
  return quote && username === quote.author;
};

// Auth
export const login = (req, res) => {
  const { username } = req.body
  const accessToken = jwt.sign(username, process.env.JWT_SECRET);
  return res.status(200).json({ accessToken });
};

export const authenticate = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token === null) {
    return res.status(401).json({ message: 'Not authenticated.' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, username) => {
    if (err) {
      return res.status(401).json({ message: 'Not authenticated.' });
    }
    req.user = { username };
  });
  next();
};

export const authorize = (req, res, next) => {
  const { username } = req.user;
  if (isAdmin(username)) {
    next();
  }

  const id = req.params.id;
  if (!id) {
    return res.status(400).json({ message: 'Missing quote ID.' });
  }
  if (isOwn(username, id)) {
    next();
  }

  return res.status(403).json({ message: 'Not authorized.' });
};
