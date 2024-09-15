const User = require("../models/Users");
const { generateToken } = require("../utils/jwtUtils");

const signup = async (req, res) => {
  try {
    const { username, bio, createdAt, email, name, password, profilePicture } =
      req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(409).json({
        status: "ERROR",
        message: "Username or email already in use",
      });
    }

    //create new user
    const user = await User.create({
      username,
      bio,
      createdAt,
      email,
      name,
      password,
      profilePicture,
    });

    res.json({
      status: "SUCCESS",
      message: "User created successfully",
      data: {
        id: user._id,
        username: user.username,
        email: user.email,
        name: user.name,
        bio: user.bio,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    console.log("signup error");
    res.status(500).json({
      status: "ERROR",
      message: error.message,
    });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      res.status(401).send("Invalid username or password");
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      res.status(401).send("Invalid username or password");
    }

    // Generate a token
    const token = generateToken({ id: user._id, username: user.username });

    // Set the token in a cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      token
    });
  } catch (error) {
    console.log(error.message);
    res.json({
      status: "FAILED",
      message: error.message,
    });
  }
};

const logout = (req, res) => {
  res.clearCookie("token");
  res.send("Logged out");
};

module.exports = { signup, login, logout };
