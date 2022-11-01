const crypto = require("crypto");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/ApiError");
const httpStatus = require("http-status");
const sendEmail = require("../notification/sendMail");


/**
 * Create a user
 * @param {Object} userBody
 * @returns {Promise<user>}
 */

const register = async (userBody) => {
  /* 
          Before saving the user in the database 
          Pre-save Hooks will be called to hash the password and save the hashed password in the database
      */
  const user = await User.create(userBody);
  return user
}

const login = async (userBody) => {
  const { email, password } = userBody;

  /* check if both email and password are given */
  if (!email || !password) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Please provide both email and password ");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Invalid Credentials ");
  }

  /* Check if entered password matched with the password in DB */
  const isMatch = await user.matchPassword(password);

  if (!user || !isMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

   /* If matches generate Token */
   const token = user.getToken();

   return token
}

const forgotpassword = async (userBody) => {
  const { email } = userBody
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email");
  }

  const MailRandomPass = Math.random().toString(36).slice(-8)

  const message = `
    <h1> You have requested for password reset </h1>
    <title>Welcome to MailService App</title></head>
    <body><div><h3>Dear customer,</h3>
    <p>  Kindly use below temporary password to login to the application with your registered email <br><br> 
     ${MailRandomPass} </p>
    <p>${process.env.EMAIL_OWNER}</p>    
`;

  await sendEmail({
    to: user.email,
    subject: process.env.EMAIL_SUBJECT,
    text: message,
  });
}

const sendMails = async (userBody) => {
  const { ReceiverMailId,subjLine,MailContent } = userBody
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Incorrect email or password");
  }

  const MailRandomPass = Math.random().toString(36).slice(-8)

  const message = `
    <h1> You have requested for password reset </h1>
    <title>Welcome to MailService App</title></head>
    <body><div><h3>Dear customer,</h3>
    <p>  Kindly use below temporary password to login to the application with your registered email <br><br> 
     ${MailRandomPass} </p>
    <p>${process.env.EMAIL_OWNER}</p>    
`;

  await sendEmail({
    to: user.email,
    subject: process.env.EMAIL_SUBJECT,
    text: message,
  });
}
module.exports = {
  register,
  login,
  forgotpassword
};