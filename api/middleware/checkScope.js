const jwt = require("jsonwebtoken");
const config = require("../config");
const userRepo = require("../routes/usersRouter/users.repository");
const checkScope = async (req, res, next) => {
  try {
    const token = req.headers.token;
    if (!token) {
      return res.status(401).json({ message: "Must have JWT." });
    }
    jwt.verify(JSON.parse(token), config.secret, async(error, decoded) => {
      if (error) {
        if (error.name === "TokenExpiredError") {
          return res.status(422).json({
            message:
              "JWT has expired. Please login again, this is for your security!",
          });
        }
        return res.status(422).json({ message: "JWT Verification Issue." });
      }
      const scope = await userRepo.getScope(decoded.id);
      
      if (scope.scope) {
        next();
      } else {
        return res
          .status(404)
          .json({ message: "User is not authorized to access the content" });
      }
    });
  } catch (error) {
    return;
  }
};
module.exports = checkScope;
