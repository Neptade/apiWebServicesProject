const jwt = require('jsonwebtoken');
const env = process.env; // Ensure to use process.env to access environment variables

const jwtAuthRest = (req) => {
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

function jwtAuthWebSocket(socket, next) {
    const token = socket.handshake.auth.token;
    if (!token) {
        return next(new Error('Authentication error'));
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return next(new Error('Authentication error'));
        }
        socket.user = decoded;
        next();
    });
}

module.exports = { jwtAuthRest, jwtAuthWebSocket };
