const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync")
const { authService } = require("../services");
const sendEmail = require("../notification/sendMail");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const register = catchAsync(async (req, res) => {
    const user = await authService.register(
        req.body,
    );
    res.status(httpStatus.CREATED).send({
        message:
            "Registered Successfully",
    });
});

const login = catchAsync(async (req, res) => {
    const user = await authService.login(
        req.body,
    );

    res.status(httpStatus.CREATED).send({
        message:
            "Successful login",
        token: user
    });
});

const forgotpassword = catchAsync(async (req, res) => {
    const user = await authService.forgotpassword(
        req.body,
    );
    res.status(httpStatus.CREATED).send({
        message:
            "Email Sent! Make sure to check your spam mail and mark not as spam.",
    });
});


const sendMails = catchAsync(async (req, res) => {

    let logintoken;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        logintoken = req.headers.authorization.split(" ")[1];
    }

    if (!logintoken) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Not authorized for this route");
    }

    const verified = await jwt.verify(logintoken, process.env.TOKEN_SECRET);

    const result = await User.findOne({ _id: verified.id }, "username id email");

    const message = `   
  <title>Welcome to MailService App</title></head> 
   ${req.body.MailContent} </p>
  <p>${process.env.EMAIL_OWNER}</p>  
`;

    if (result.username) {
        await sendEmail({
            to: req.body.ReceiverMailId,
            subject: req.body.subjLine,
            text: message,
        });

        res.status(httpStatus.CREATED).send({
            message:
                "Email Sent! Make sure to check your spam mail and mark not as spam.",
        });
    }
    else {
        res.status(httpStatus.UNAUTHORIZED).send({
            message:
                "unauthorized",
        });
    }
});

module.exports = {
    register,
    login,
    forgotpassword,
    sendMails
};