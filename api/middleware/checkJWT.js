const jwt = require("jsonwebtoken");
const config = require("../config");

const checkJWT = (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "Must have JWT." });
    }
    jwt.verify(JSON.parse(token), config.secret, (error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(422).json({
            message:
              "JWT has expired. Please login again, this is for your security!",
          });
        }
        return res.status(422).json({ message: "JWT Verification Issue." });
      }
      next();
    });
  } catch (error) {
    return;
  }
};
module.exports = checkJWT;
