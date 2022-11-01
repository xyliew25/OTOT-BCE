import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const UserModelSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
});

export default mongoose.model('UserModel', UserModelSchema)
