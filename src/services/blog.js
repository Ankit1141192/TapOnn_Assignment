const { db } = require("./firebase");
const { NotFoundError, ValidationError } = require("../utils/errors");

const createBlog = async (title, content, authorId, authorEmail) => {
  if (!title || !content) {
    throw new ValidationError("Title and content are required");
  }

  if (title.trim().length === 0 || content.trim().length === 0) {
    throw new ValidationError("Title and content cannot be empty");
  }

  const blog = {
    title,
    content,
    authorId,
    authorEmail,
    createdAt: new Date(),
  };

  const docRef = await db.collection("blogs").add(blog);

  return {
    id: docRef.id,
    ...blog,
  };
};

const getBlogs = async () => {
  const snapshot = await db
    .collection("blogs")
    .orderBy("createdAt", "desc")
    .limit(20)
    .get();

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

const getBlogById = async (blogId) => {
  const doc = await db.collection("blogs").doc(blogId).get();

  if (!doc.exists) {
    throw new NotFoundError("Blog not found");
  }

  return {
    id: doc.id,
    ...doc.data(),
  };
};

module.exports = {
  createBlog,
  getBlogs,
  getBlogById,
};
