const express = require("express");
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const app = express();
const cookieParser = require("cookie-parser");
const { signup, login, logout } = require("./controllers/UserController");
const { authenticateJWT } = require("./middleware/authenticateJwt");
const router = express.Router();
const {
  createBlog,
  getAllBlogs,
  getBlog,
  deleteBlog,
  updateBlog,
  getUsersBlog,
} = require("./controllers/BlogController");

const PORT = process.env.PORT || 8000;

dotenv.config();
app.use(express.json());
app.use(cookieParser());
app.use(cors())


app.post("/signup", signup);

app.post("/login", login);

app.post("/logout",logout);

app.get("/api/protected", authenticateJWT, (req, res) => {
  res.send(`hello ${req.user.username} this is protected route`);
});

app.get("/api/blogs", getAllBlogs);


router.use(authenticateJWT);

router.get('/api/users/:userId/blogs', getUsersBlog);
router.post("/api/blogs",createBlog);
router.route("/api/blogs/:id").get(getBlog).patch(updateBlog).delete(deleteBlog);

app.use(router);

// DB
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log("ERR", err));

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
