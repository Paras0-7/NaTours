const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name'],
  },
  email: {
    type: String,
    required: [true, 'A user must have an email'],
    unique: true,
    lowercase: true, // Jonas@gmail -. jonas@gmail

    validate: [validator.isEmail, 'Please provide a valid email'], // validation function
  },

  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // this will only work on save
      validator: function (val) {
        return this.password === val;
      },
      message: 'The password does not match. Please enter the correct password',
    },

    passwordChangedAt: {
      type: Date,
    },
  },
});

userSchema.pre('save', async function (next) {
  // this refers to current document
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 12); // asynchronous function
  this.passwordConfirm = undefined;
  next();
});

// instance methods : available on each documents of a collection
userSchema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) return false;
};
const User = mongoose.model('User', userSchema);

module.exports = User;
