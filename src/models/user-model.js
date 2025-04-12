const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, 'Username is required'],
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters'],
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

UserSchema.statics.createAccount = async function (username, firstName, lastName, phoneNumber, reference) {
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

  const user = await this.create({
    username,
    firstName,
    lastName,
    phoneNumber,
    reference,
  });
  return user;
};

UserSchema.statics.login = async function (phoneNumber, reference) {
  if (!phoneNumber || !reference) {
    throw new Error('Phone number and reference are required');
  }

  const user = await this.findOne({ phoneNumber, reference });
  if (!user) {
    throw new Error('Invalid phone number or reference');
  }

  return user;
};

module.exports = mongoose.model('User', UserSchema);