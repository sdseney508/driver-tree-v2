const jwt = require("jsonwebtoken");
const session = require("../models/session");
const adminAudit = require("../models/adminAudit");

// set token secret and expiration date
const secret = "drivertree";
const expiration = "2h";

const SESSION_TIMEOUT = 10*60*1000; // 10 minutes in milliseconds to meet both user and admin requirements

module.exports = {
  // function for our authenticated routes
  authMiddleware: async function (req, res, next) {
    // allows token to be sent via  req.query or headers
    // Added tokens to be sent via req.body as well
    let token = req.query.token || req.body.token || req.headers.authorization;
    if (!token) {
      return res.status(409).json({ message: "You have no token!" });
    }
    const thisSession = await session.findOne({ where: { token: token.split(" ").pop().trim() } });
    if (!thisSession) {
      return res.status(401).send("Session not found");
    }

    const now = Date.now();
    const lastActivity = new Date(thisSession.lastActivity);
    const lastActivityMilliseconds = lastActivity.getTime();
    const inactiveTime = now - lastActivityMilliseconds;

    if (inactiveTime > SESSION_TIMEOUT) {
      // Session expired
      await thisSession.destroy(); // Remove the expired session

      //log the session expiration
      await adminAudit.create({
        action: `Session expired for token ${token}`,
        newData: JSON.stringify(thisSession),
        oldData: "NA",
        model: "Session",
        userId: thisSession.userId,
        fieldName: "lastActivity",
        tableUid: thisSession.userId
      });
      return res.status(401).send("Session expired");

    }

    // Update lastActivity to the current time
    thisSession.lastActivity = Date.now();
    await thisSession.save();
    if (req.headers.authorization) {
      token = token.split(" ").pop().trim();
    }

    // verify token and get user data out of it
    try {
      const { data } = jwt.verify(token, secret, { maxAge: expiration });
      req.id = data.id;
    } catch {
      return res.status(400).json({ message: "invalid token!" });
    }
    // send to next endpoint
    next();
  },

  signToken: function ({ id }) {
    const payload = { id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
};
