const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User reference
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});


const Blog = mongoose.model('Blog', blogSchema);

module.exports = Blog;