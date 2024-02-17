const router = require("express").Router();
const { User } = require("../../models");
const { signToken } = require("../../utils/auth");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

//import middleware
// put authMiddleware anywhere we need to send a token for verification of user. this will maintain their login for up to 2 hours.
const { authMiddleware } = require("../../utils/auth");
const secret = "drivertree";
const expiration = "2h";
// use /api/users for all the axios calls


//i do not have the ability to delete a user.  I can only change their status to inactive.  This is to prevent accidental deletion of a user.  I can change the status to active if needed.

//get a specific user.  will be used by the admin page to fill in the react table.  When he selects a specific user, the id of the selected user will be passed to the get /:id route
router.get("/userbyID/:id", async (req, res) => {
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
router.get("/", async (req, res) => {
  try {
    const userData = await User.findAll();
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get all coordinators emails.
router.get("/coordinators", async (req, res) => {
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
    const userData = await User.findAll({ where: 
      { userRole: req.params.urole, } 
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
    const token = signToken(userData);
    const userUpdate = await User.update( {password: req.body.password}, {
      where: {
        id: userData.id,
      },
    });
    res.status(200).json({ token, userData });
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
      console.log("email is incorrect");
      return res
        .status(400)
        .json({ message: "Incorrect email or password, please try again" });
    }
    const validPassword = await userData.checkPassword(req.body.password);
    // const updateLastLogin = await userData.updateLastLogin();
    if (validPassword !== true) {
      console.log("password is incorrect");
      res.status(401).json();
      return;
    }
    const token = signToken(userData);

    res.json({ token, user: userData, message: "You are now logged in!" });
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update User info
router.put("/:id", async (req, res) => {
  try {
    const userData = await User.findByPk(req.params.id)
    if (!userData) {
      res.status(404).json({ message: "No User found with this id!" });
      return;
    } else {
      await User.findByPk(req.params.id).then((results) => {results.update(req.body)})
    }
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});



module.exports = router;
