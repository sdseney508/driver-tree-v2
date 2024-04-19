const router = require("express").Router();
const { User, session, adminAudit } = require("../../models");
const { signToken } = require("../../utils/auth");

//import middleware
// put authMiddleware anywhere we need to send a token for verification of user. this will maintain their login for up to 2 hours.
const { authMiddleware } = require("../../utils/auth");
const secret = "drivertree";
const expiration = "2h";
// use /api/users for all the axios calls

//I can only change their status to inactive.  This is to prevent accidental deletion of a user.  I can change the status to active if needed.

//get a specific user.  will be used by the admin page to fill in the react table.  When he selects a specific user, the id of the selected user will be passed to the get /:id route
router.get("/userbyID/:id", authMiddleware, async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userData = await User.findByPk(req.id);
    if (!userData) {
      return res
        .status(400)
        .json({ message: "Cannot find a user with this id!" });
    }
    res.status(200).send(userData);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

// get all users.
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userData = await User.findAll();
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all coordinators emails.
router.get("/coordinators", authMiddleware, async (req, res) => {
  try {
    const userData = await User.findAll({
      where: {
        userRole: "Coordinator",
      },
      attributes: ["email"],
    });
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// post all users emails.  used for the admin notification page.
router.get("/emails", async (req, res) => {
  try {
    const userData = await User.findAll({
      where: {
        userStatus: "Active",
      },
      attributes: ["email"],
    });
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all users with a specific roll.
router.get("/role/:urole", async (req, res) => {
  try {
    const userData = await User.findAll({
      where: { userRole: req.params.urole },
    });
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//create a user
router.post("/", async (req, res) => {
  try {
    const userData = await User.create(req.body);
    if (!User) {
      return res.status(400).json({ message: "Something went wrong!" });
    }
    const token = signToken({ id: userData.id });
    const userUpdate = await User.update(
      { password: req.body.password },
      {
        where: {
          id: userData.id,
        },
      }
    );
    res.status(200).json({ token, userData });
    await adminAudit.create({
      action: `System created new user and assigned userId ${userData.id}`,
      newData: JSON.stringify(userData),
      oldData: "NA",
      model: "User",
      userId: userData.id,
      fieldName: "All",
      tableUid: userData.id,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

// login once you have an account
router.post("/login", async (req, res) => {
  try {
    //using email since it is a unique field in the user table
    const userData = await User.findOne({ where: { email: req.body.email } });
    if (!userData) {
      return res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
    }
    //must  be done in the following order on the server, the first one checks if the user has a valid password.  if they do, then you check their status, only after both of those are complete can you update the last login date.
    const validPassword = await userData.checkPassword(req.body.password);
    if (validPassword !== true) {
      //user has entered an incorrect password, return a 401 and update the failed login count in the user table to count+1.  if this is the first time they failed log in, set the last failed login date to now.  if they have failed 3 times, set their status to inactive.
      console.log("password is invalid");
      await userData.updateFailedLoginTimer(userData.id);
      res.status(401).json();
      return;
    } else {
      console.log("password is valid");
      //reset the failed login count and the failed login timer
      await userData.resetFailedLoginTimer(userData.id);
    }
    const inactive = await userData.updateStatusBasedOnLastLogin(userData.id);
    if (inactive === true) {
      await adminAudit.create({
        action: `System changed user account to inactive for ${userData.id}`,
        newData: "Account status: Inactive",
        oldData: "NA",
        model: "User",
        userId: userData.id,
        fieldName: "userStatus",
        tableUid: userData.id,
      });
      res
        .status(402)
        .json({
          message:
            "Your account is inactive.  Please contact your administrator to reactivate your account",
        });
      return;
    }
    await userData.updateLastLogin();
    const token = signToken({ id: userData.id });
    // Create session
    const sessionExpiry = Date.now() + 15*60*1000;
    let userSession = await session.create({ token, userId: userData.id, expiresAt: sessionExpiry });
    await adminAudit.create({
      action: `${userData.id} logged in to the system`,
      newData: JSON.stringify(userSession),
      oldData: "NA",
      model: "User",
      userId: userData.id,
      fieldName: "lastLogin",
      tableUid: userData.id,
    });  
    res.json({ token, user: userData, message: "You are now logged in!" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update User info
router.put("/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    if (!userData) {
      res.status(404).json();
      return;
    } else {
      //no update just the fields in the req.body
      await User.findByPk(req.params.id).then((results) => {
        results.update(req.body);
      });
    }
    await adminAudit.create({
      action: `user account updated by userId ${userData.id}`,
      newData: JSON.stringify(req.body),
      oldData: JSON.stringify(userData),
      model: "User",
      userId: userData.id,
      fieldName: "All",
      tableUid: userData.id,
    });
    res.status(200).json();
  } catch (err) {
    console.log(err);
    res.status(405).json(err);
  }
});

//delete a user account
router.delete("/delete/:id/:adminId", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id);
    console.log(userData);
    if (!userData) {
      res.status(404).json();
      return;
    } else {
      await User.destroy({
        where: {
          id: req.params.id,
        },
      });
    }
    await adminAudit.create({
      action: `user account ${req.params.id} deleted by userId ${req.params.admninId}`,
      newData: "NA",
      oldData: JSON.stringify(userData),
      model: "User",
      userId: req.params.adminId,
      fieldName: "All",
      tableUid: req.params.id,
    });
    res.status(200).json({ message: "User account deleted"});
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

module.exports = router;
