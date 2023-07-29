
const jwt = require("jsonwebtoken");
// Function to protect routes using JWT authentication
function authenticateToken(req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    const secretKey = 'mysecretKeyf2121'
    if (!token) return res.status(401).json({ message: 'Access denied.' });
  
    jwt.verify(token, secretKey, (err, user) => {
      if (err) {
        console.log(err)
        return res.status(403).json({ message: 'Invalid token.' });}

      req.user = user;
      next();
    });
  }

module.exports= authenticateToken;