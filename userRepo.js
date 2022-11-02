import 'dotenv/config';
import mongoose from 'mongoose';
import redis from 'redis';

import UserModel from './userModel.js';

// Cache initialization
const EXPIRATION = 10;
const redisClient = process.env.ENV == 'PROD' 
  ? redis.createClient({
    socket: {
      host: process.env.REDIS_CLOUD_HOST,
      port: process.env.REDIS_CLOUD_PORT,
    },
    password: process.env.REDIS_CLOUD_PASSWORD,
  })
  : redis.createClient();
await redisClient.connect();
redisClient.on('error', err => {
  console.log('Redis connection error: ' + err);
});

// Database initialization
const mongoDbUri = process.env.ENV == 'PROD' ? process.env.MONGODB_CLOUD_URI : process.env.MONGODB_LOCAL_URI;
mongoose.connect(mongoDbUri, { useNewUrlParser: true, useUnifiedTopology: true });
const mongoDb = mongoose.connection;
mongoDb.on('error', console.error.bind(console, 'MongoDB connection error: '));

export const createUser = async (username, role) => {
  const user = new UserModel({ username, role });
  await user.save();
  return user;
};

export const getUsers = async () => {
  const cachedUsers = await redisClient.get('users');
  if (cachedUsers) {
    console.log('cache hit');
    return JSON.parse(cachedUsers);
  }

  console.log('cache miss');
  const users = await UserModel.find();
  await redisClient.setEx('users', EXPIRATION, JSON.stringify(users));
  return users;
};

export const getUser = async (username) => {
  return await UserModel.findOne({ username }).exec();
};

export const updateUser = async (username, role) => {
  return await UserModel.findOneAndUpdate({ username }, { role }, {
    new: true,
    rawResult: true,
  });
};

export const deleteUser = async (username) => {
  return await UserModel.deleteOne({ username });
};

export const deleteAllUsers = async () => {
  return await UserModel.deleteMany({});
}
