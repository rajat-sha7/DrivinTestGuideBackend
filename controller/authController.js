const User = require("../models/UsersModal.js");
const jwt = require("jsonwebtoken");
const createError = require("../utils/appError.js");
const bcrypt = require("bcryptjs");

//register user

exports.signup = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return next(new createError("User already exists!", 400));
    }

    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    
    const newUser =    await User.create({
      ...req.body,
      password: hashedPassword,
    });

    //Assign jwt (jason web token) to user
    const token = jwt.sign({ _id: newUser._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(201).json({
      status: "success",
      message: "User registered successfully",
      token,
      user:{
        _id : newUser._id,
        name:newUser.name,
        email:newUser.email,
      }
    });
  } catch (error) {
    next(error);
  }
};

//login user
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return next(new createError("user not found", 404));

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return next(new createError("Incorrect email or password", 401));
    }
    const token = jwt.sign({ id: user._id }, "secretkey123", {
      expiresIn: "90d",
    });

    res.status(200).json({
      status: "success",
      token,
      message: "Logged In successfully",
      user:{
        _id : user._id,
        name:user.name,
        email:user.email,
      }
    });
  } catch (error) {
    next(error);
  }
};
