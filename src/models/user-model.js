const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    minlength: [1, 'First name must be at least 1 character'],
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    minlength: [1, 'Last name must be at least 1 character'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Phone number is required'],
    unique: true,
    trim: true,
    match: [/^\+?[1-9]\d{1,14}$/, 'Please enter a valid phone number'], 
  },
  reference: {
    type: String,
    required: [true, 'Reference is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Reference must be at least 3 characters'],
  },
});

UserSchema.statics.createAccount = async function (username, password, firstName, lastName, phoneNumber, reference) {
  const exists = await this.findOne({
    $or: [{ username }, { phoneNumber }, { reference }],
  });
  if (exists) {
    if (exists.username === username) {
      throw new Error('Username already exists');
    }
    if (exists.phoneNumber === phoneNumber) {
      throw new Error('Phone number already exists');
    }
    if (exists.reference === reference) {
      throw new Error('Reference already exists');
    }
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    username,
    password: hash,
    firstName,
    lastName,
    phoneNumber,
    reference,
  });
  return user;
};

UserSchema.statics.login = async function (username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required');
  }

  const user = await this.findOne({ username });
  if (!user) {
    throw new Error('Invalid username');
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    throw new Error('Invalid password');
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);