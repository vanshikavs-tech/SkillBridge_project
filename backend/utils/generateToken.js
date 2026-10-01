const jwt = require('jsonwebtoken');

/**
 * Generate a JSON Web Token (JWT) for a user.
 * 
 * Concept:
 * A JWT contains three parts: Header, Payload, and Signature.
 * Payload holds the user's unique MongoDB _id and their role ('CLIENT', 'FREELANCER', 'ADMIN').
 * This token is signed with a secret key so the server can verify the user on subsequent requests.
 * 
 * @param {string} userId - MongoDB ObjectId of the user
 * @param {string} role - Role of the user ('CLIENT' | 'FREELANCER' | 'ADMIN')
 * @returns {string} - Signed JWT string
 */
const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET || 'skillbridge_default_secret_key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

module.exports = generateToken;
