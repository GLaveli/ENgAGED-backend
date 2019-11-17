const mongoose = require('../../database');
const paginete = require('mongoose-paginate-v2');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: false,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  passwordResetToken: {
    type: String,
    select: false,
  },
  passwordResetExpires: {
    type: Date,
    select: false,
  },
  userAvatar: {
    type: String,
    required: false,
  },
  gitUrl: {
    type: String,
    required: false,
  },
  facebookUrl: {
    type: String,
    required: false,
  },
  twitterUrl: {
    type: String,
    required: false,
  },
  youotubeUrl: {
    type: String,
    required: false,
  },
  linkedinUrl: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }

});

UserSchema.pre('save', async function (next) {

  const hash = await bcrypt.hash(this.password, 10);

  this.password = hash;

  next();

});

UserSchema.plugin(paginete);

const User = mongoose.model('User', UserSchema);

module.exports = User;