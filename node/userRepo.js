import 'dotenv/config';

import { initFile, readFile, writeFile } from './fileHelper.js';

// Database initialization
let dbPath;
if (process.env.ENV == 'DEV') {
  dbPath = process.env.USER_DB_PATH;
  initFile(dbPath, []);
}
const rawUsers = readFile(dbPath);
export let users = JSON.parse(rawUsers);

export const createUser = (username, role) => {
  const user = { username, role };
  users.push(user);
  writeFile(dbPath, users);
  return user;
};

export const getUser = (username) => {
  const user = users.filter(user => user.username == username);
  return user.length > 0 ? user[0] : null;
};

export const deleteUser = (username) => {
  users = users.filter(user => user.username != username);
  writeFile(dbPath, users);
};
