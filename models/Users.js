const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    minLength: [3, "Username must be at least 3 character long"],
    maxLength: [20, "Username cannot exceed 20 characters"],
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowerCase: true,
    trim: true,
    validate: {
      validator: function (v) {
        return /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: [6, "Password must be at least 6 characters long"],
  },
  name: { type: String, trim: true },
  bio: { type: String, trim: true },
  profilePicture: {
    type: String,
    validate: {
      validator: function (v) {
        return /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif))$/.test(v); // URL validation for image
      },
      message: (props) =>
        `${props.value} is not a valid URL for a profile picture!`,
    },
  },
  createdAt: { type: Date, default: Date.now },
});

// Hash the password before saving the user
userSchema.pre("save", async function (next) {
  // Only hash if password is modified
  if (!this.isModified("password")) return next();

  try {
    const salt = await bcrypt.genSalt(10); // Generate salt
    this.password = await bcrypt.hash(this.password, salt); // Hash the password
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

const User = mongoose.model("User", userSchema);

module.exports = User;
