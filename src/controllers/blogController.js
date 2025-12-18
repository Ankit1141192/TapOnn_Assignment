const blogService = require('../services/blog.js');
const { sendSuccess, sendError } =  require('../utils/response.js');
const { ValidationError, NotFoundError } = require('../utils/errors.js');

const createBlog = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json(sendError('Unauthorized'));
    }

    const { title, content } = req.body;

    const blog = await blogService.createBlog(
      title,
      content,
      req.user.uid,
      req.user.email
    );

    res.status(201).json(sendSuccess('Blog created successfully', blog));
  } catch (error) {
    if (error instanceof ValidationError) {
      return res.status(400).json(sendError(error.message));
    }

    res.status(500).json(sendError('Error creating blog', error.message));
  }
};

const listBlogs = async (req, res) => {
  try {
    const blogs = await blogService.getBlogs();

    res.json(sendSuccess('Blogs retrieved successfully', blogs));
  } catch (error) {
    res.status(500).json(sendError('Error retrieving blogs', error.message));
  }
};

const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;

    const blog = await blogService.getBlogById(id);

    res.json(sendSuccess('Blog retrieved successfully', blog));
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json(sendError(error.message));
    }

    res.status(500).json(sendError('Error retrieving blog', error.message));
  }
};

module.exports = {
    getBlogById,
    listBlogs,
    createBlog
}