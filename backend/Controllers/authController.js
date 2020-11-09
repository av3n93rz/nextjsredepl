const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const signToken = id => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, req, res) => {
  const token = signToken(user._id);

  res.cookie('jwt', token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
  });
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.login = catchAsync(async (req, res, next) => {
  const { email, pwValues } = req.body;

  if (!email || !pwValues.password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(pwValues.password, user.password))) {
    return next(new AppError('Incorrect email or password', 401));
  }

  createSendToken(user, 200, req, res);
});

exports.isLoggedIn = async (jwt_token) => {
    try {
      const decoded = await promisify(jwt.verify)(
        jwt_token,
        process.env.JWT_SECRET
      );
      const currentUser = await User.findById(decoded.id).select('-password');

      if (!currentUser) {
        return null;
      }

      return currentUser;
    } catch (err) {
      return {error: err.message}
    }
}

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 1 * 1000),
    httpOnly: true
  });
  res.status(200).json({ status: 'success' });
};

exports.signup = catchAsync(async (req, res) => {
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  newUser.save((err, newUser) => {
    if (err) {
        return res.status(400).json({
            error: 'Email is already registered!'
      });
    }
    createSendToken(newUser, 201, req, res);
});
});