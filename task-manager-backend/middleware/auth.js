const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  console.log("Authorization Header:", authHeader); // Debugging statement

  if (!authHeader) {
    console.log("No token provided"); // Debugging statement
    return res.status(401).send("Access Denied");
  }

  const token = authHeader.replace("Bearer ", "");
  console.log("Token:", token); // Debugging statement

  try {
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // Debugging statement
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Verified Token:", verified); // Debugging statement
    req.user = verified;
    next();
  } catch (err) {
    console.error("Invalid Token:", err); // Debugging statement
    res.status(400).send("Invalid Token");
  }
};

module.exports = authenticate;
