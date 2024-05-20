const httpStatus = require("http-status");
const JWT = require("jsonwebtoken");

//  Implement authentication middleware
const authenticateToken = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // Check if token is missing
  if (token == null) {
    return res.status(httpStatus.UNAUTHORIZED).send({ error: "not authorized" });
  } else {
    // Verify token
    JWT.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
      if (err) {
        // Handle token verification error
        return res.status(httpStatus.FORBIDDEN).send({ error: err });
      }
      // Attach user data to request object
      req.user = user?._doc;
      next();
    });
  }
};

module.exports = authenticateToken;
