const jwt = require('jsonwebtoken');
const env = process.env; // Ensure to use process.env to access environment variables

const jwtAuth = (req) => {
    const token = req.header('Authorization');
    if (!token) {
        throw new Error("Authorization token is missing");
    }
    if (!token.startsWith("Bearer ")) {
        throw new Error("Authorization token should start with Bearer");
    }
    const jwtToken = token.substring(7, token.length);
    try {
        const decoded = jwt.verify(jwtToken, env.JWT_SECRET || '');
        req.user = decoded;
    } catch (err) {
        throw new Error("Invalid token");
    }
};

module.exports = { jwtAuth };
