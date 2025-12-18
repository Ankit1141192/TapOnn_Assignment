const { Router } = require("express");
const {createBlog,listBlogs,getBlogById} = require("../controllers/blogController");
const requireAuth = require("../middleware/requireAuth");

const router = Router();

router.post("/", requireAuth, createBlog);
router.get("/", listBlogs);
router.get("/:id", getBlogById);

module.exports = router;
