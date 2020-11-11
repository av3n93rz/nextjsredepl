const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const User = require('../models/UserModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const nodemailer = require("nodemailer");
const { encrypt, decrypt } = require('../utils/crypto');
require('dotenv').config();
const AppUrl = process.env.APP_URL

const sendMail = async(hash, newUser) => {

const transporter = nodemailer.createTransport({
  service: "gmail",
    auth: {
        user: "prime.solutions.dev@gmail.com",
        pass: "kvucmbbinfupqkda"
    }
});

const mailOptions = {
  from: 'prime.solutions.dev@gmail.com', // sender address
  to: `${newUser.email}`, // list of receivers
  subject: "Please Verify Your Account", // Subject line
  html: `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title></title>
  </head>
  <body style="padding: 0px; margin: 0px; background:#fff; padding-bottom:25px">
    <div style='max-width:750px; margin-left: auto; margin-right: auto;'>
      <div style='width:100%; background:#234f72; height: 150px; padding-top: 25px;'>
        <img src="https://ik.imagekit.io/yy12fco4k5/e-text-logo_bneAp8jwtW-j.png" width='150px' style='margin:0px auto 0px auto; display: flex;'>
        <p style='font-family: Arial, Helvetica, sans-serif; font-size: 1.4rem; color:#fff; font-weight:800; margin-top: 10px; margin-bottom: 10px; text-align: center'>Welcome to Ecommerce shop!</p>
      </div>
      <div>
        <h1 style='font-family: Arial, Helvetica, sans-serif; font-size: 1rem; margin-left: 25px; color: #000'> Hi ${newUser.name},</h1>
      </div>
      <div>
        <h2 style='font-family: Arial, Helvetica, sans-serif; font-size: 1.2rem; display: flex; padding-left: 25px; padding-right:25px; margin-top:10px; color:#000'>Please confirm your email address to activate your account!</h2>
        <div style='display: flex; justify-content: flex-start; padding-left: 25px; margin-bottom:25px'>
          <a href='${AppUrl}/verification/?verify_Id=${hash.iv}_${hash.content}' style='font-family: Arial, Helvetica, sans-serif; font-size: 1rem; text-decoration: none; word-break: break-all;'><button style='padding:10px; background:#fdc54a; border: none; border-radius: 4px; font-weight: 600; cursor: pointer; color:#000'>Activate account</button></a>
        </div>
        <hr/>
        <div>
          <p style='margin-left: 25px; margin-right: 25px; font-size: 0.8rem; font-family: Arial, Helvetica, sans-serif; opacity: 0.5; color:#000'>If you didn't sign up to Ecommerce shop, please ignore this email. It's likely someone else accidentally entered your address or made a typo.</p>
        </div>
      </div>
    </div>
  </body>
  </html>`, // html body
}

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    return console.log(error);
  }
  console.log('Message %s sent: %s', info.messageId, info.response);
})
}

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
  const account = `${newUser._id}_${Date.now() + 86400000}`
  const jwt_acc = jwt.sign({account}, process.env.JWT_SECRET)
  const hash = encrypt(jwt_acc);
  newUser.activated = JSON.stringify(hash)
  newUser.save((err, newUser) => {
    if (err) {
        return res.status(400).json({
            error: 'Email is already registered!'
      });
    }
    sendMail(hash, newUser)
    createSendToken(newUser, 201, req, res);
  });
});

exports.sendToken = catchAsync(async (req, res)=>{
  const user = await User.findById(req.params.id).select('-password')
  if(user.activated === 'true'){
    res.status(400).json({ status: 'Your account is already verified!' })
  } else {
    const account = `${user._id}_${Date.now() + 86400000}`
    const jwt_acc = jwt.sign({account}, process.env.JWT_SECRET)
    const hash = encrypt(jwt_acc);
    user.activated = JSON.stringify(hash)
    user.save()
    sendMail(hash, user)
    res.status(200).json({ status: 'We have sent you a verification email!' })
  }
})

exports.verify = catchAsync(async (req, res) => {
  const hash = req.params.id.split('_')
  const decripted_jwt = decrypt({
    iv: hash[0],
    content: hash[1]
  })
  const decoded = await promisify(jwt.verify)(
    decripted_jwt,
    process.env.JWT_SECRET
  );
  const user_date = decoded.account.split('_')
  const currentUser = await User.findById(user_date[0]).select('-password')
  if(currentUser){
    if(currentUser.activated === JSON.stringify({
      iv: hash[0],
      content: hash[1]
    })){
      const curDate = Date.now()
      if(curDate < user_date[1]){
        currentUser.activated = 'true'
        await currentUser.save()
        res.status(200).json({ status: 'Account verified!' });
      } else {
        res.status(400).json({ status: 'Link expired!', user: currentUser})
      }
    } else {
      res.status(400).json({ status: 'Your account is already verified!' })
    }
  } else {
    res.status(404).json({ status: 'No account found!' })
  }
  
});