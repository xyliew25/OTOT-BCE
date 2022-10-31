import {
  createUser as _createUser,
  getUser as _getUser,
  deleteUser as _deleteUser,
} from './userRepo.js';
import { isValidRole } from './auth.js';

// CRUD
export const createUser = (req, res) => {
  const { username, role } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Missing user username.' });
  }
  if (!role) {
    return res.status(400).json({ message: 'Missing user role.' });
  }
  if (!isValidRole(role)) {
    return res.status(400).json({ message: 'Invalid user role.' });
  }

  try {
    const createdUser = _createUser(username, role);
    return res.status(201).json(createdUser);
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};

export const getUser = (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ message: 'Missing user username.' });
  }

  const user = _getUser(username);
  if (user) {
    return res.status(200).json(user);
  } else {
    return res.status(400).json({ message: `User with username ${username} does not exist.` });
  }
};

export const deleteUser = (req, res) => {
  const username = req.params.username;
  if (!username) {
    return res.status(400).json({ message: 'Missing user username.' });
  }

  try {
    _deleteUser(username);
    return res.status(200).json({ username });
  } catch (e) {
    return res.status(500).json({ message: 'Internal server error.' });
  }
};
