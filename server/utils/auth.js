const jwt = require("jsonwebtoken");

// set token secret and expiration date
const secret = "drivertree";
const expiration = "2h";

module.exports = {
  // function for our authenticated routes
  authMiddleware: function (req, res, next) {
    // allows token to be sent via  req.query or headers
    // Added tokens to be sent via req.body as well
    let token = req.query.token || req.body.token || req.headers.authorization;

    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    if (!token) {
      return res.status(400).json({ message: 'You have no token!' });
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.id = data.id;
    } catch {
      return res.status(400).json({ message: 'invalid token!' });
    }
    // send to next endpoint
    next();
  },

  signToken: function ({
    email,
    id,
    firstName,
    lastName,
    userCommand,
    userRole,
  }) {
    const payload = { email, id, firstName, lastName, userRole, userCommand };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
