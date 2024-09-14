const Blog = require("../models/Blog");

async function getAllBlogs(req, res) {
  try {
    const blogs = await Blog.find();
    res.status(200).json({
      status: "SUCCESS",
      data: blogs,
    });
  } catch (error) {
    res.status(404).json({
      status: "FAILED",
      message: error.message,
    });
  }
}

async function createBlog(req, res) {
  try {
    const { title, body } = req.body;
    const newBlog = await Blog.create({ title, body, author: req.user._id });
    res.status(201).json({
      status: "SUCCESS",
      message: "Blog created",
      data: newBlog,
    });
  } catch (error) {
    res.status(500).json({ status: "ERROR", message: error.message });
  }
}

async function getBlog(req, res) {
  try {
    const id = req.params.id;
    const blog = await Blog.findOne({ _id: id, author: req.user });
    if (!blog) {
      throw new Error("No blog found");
    }
    return res.status(201).json({
      status: "SUCCESS",
      data: blog,
    });
  } catch (error) {
    res.json({
      status: "ERROR",
      message: error.message,
    });
  }
}

async function getUsersBlog(req, res) {
  try {
    const { userId } = req.params;
    const blogs = await Blog.find({ author: userId });
    return res.json({
      status: "SUCCESS",
      data: blogs,
    });
  } catch (error) {
    res.json({
      status: "ERROR",
      message: error.message,
    });
  }
}

async function updateBlog(req, res) {
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body);
    res.json({
      status: "PENDING",
      data: blog,
    });
  } catch (error) {
    res.json({
      status: "ERROR",
      message: error.message,
    });
  }
}

async function deleteBlog(req, res) {
  (req, res) => {
    res.json({
      status: "PENDING",
    });
  };
}

module.exports = {
  getAllBlogs,
  createBlog,
  getBlog,
  getUsersBlog,
  updateBlog,
  deleteBlog,
};
