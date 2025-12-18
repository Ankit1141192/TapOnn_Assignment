const axios = require("axios");
const { auth } = require("../services/firebase");
const { ValidationError, UnauthorizedError } = require("../utils/errors");
const { sendSuccess, sendError } = require("../utils/response");
const env = require("../config/env");

const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const validatePassword = (password) => password.length >= 6;

const signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) throw new ValidationError("Email and password are required");
    if (!validateEmail(email)) throw new ValidationError("Invalid email format");
    if (!validatePassword(password)) throw new ValidationError("Password must be at least 6 characters");

    const userRecord = await auth.createUser({ email, password });

    return res.status(201).json(
      sendSuccess("User created successfully", {
        uid: userRecord.uid,
        email: userRecord.email,
      })
    );
  } catch (error) {
    if (error instanceof ValidationError) return res.status(error.statusCode || 400).json(sendError(error.message));
    if (error.code === "auth/email-already-exists") return res.status(400).json(sendError("Email already exists"));
    return res.status(500).json(sendError("Error creating user", error.message));
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new ValidationError("Email and password are required");
    if (!validateEmail(email)) throw new ValidationError("Invalid email format");

    const response = await axios.post(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${env.FIREBASE.apiKey}`,
      { email, password, returnSecureToken: true }
    );

    return res.json(
      sendSuccess("Login successful", {
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      })
    );
  } catch (error) {
    const firebaseError = error.response?.data?.error?.message;

    if (firebaseError === "INVALID_PASSWORD" || firebaseError === "EMAIL_NOT_FOUND") {
      return res.status(401).json(sendError("Invalid email or password"));
    }

    return res.status(500).json(sendError("Login failed", error.message));
  }
};
const me = async (req, res) => {
  try {
    if (!req.user) throw new UnauthorizedError("User not authenticated");

    const userRecord = await auth.getUser(req.user.uid);

    return res.json(
      sendSuccess("User retrieved successfully", {
        uid: userRecord.uid,
        email: userRecord.email,
        emailVerified: userRecord.emailVerified,
        createdAt: userRecord.metadata.creationTime,
      })
    );
  } catch (error) {
    return res.status(error.statusCode || 500).json(sendError("Error retrieving user", error.message));
  }
};

module.exports = {
  signup,
  login,
  me,
};
