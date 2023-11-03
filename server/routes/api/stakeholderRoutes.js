const router = require("express").Router();
const { stakeholder } = require("../../models");
const { signToken } = require("../../utils/auth");

//import middleware
// put authMiddleware anywhere we need to send a token for verification of user. this will maintain their login for up to 2 hours.
const { authMiddleware } = require("../../utils/auth");
const secret = "drivertree";
const expiration = "2h";
// use /api/stakeholders for all the axios calls


//get a specific stakeholder.  will be used by the admin page to fill in the react table.  When he selects a specific user, the id of the selected user will be passed to the get /:id route
router.get("/stakeholderByID/:id", async (req, res) => {
  try {
    const stakeholderData = await stakeholder.findByPk(req.params.id);
    res.status(200).json(userData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get all stakeholders
router.get("/", async (req, res) => {
  try {
    const stakeholderData = await stakeholder.findByPk(req.id);
    if (!userData) {
      return res
        .status(400)
        .json({ message: "Cannot find a user with this id!" });
    }
    res.status(200).send(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//create a stakeholder
router.post("/", async (req, res) => {
  try {
    const stakeholderData = await stakeholder.create(req.body);
    if (!stakeholderData) {
      return res.status(400).json({ message: "Something went wrong!" });
    }
    res.status(200).json(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update stakeholder info
router.put("/:id", async (req, res) => {
  try {
    const stakeholderData = await stakeholder.findByPk(req.params.id)
    if (!stakeholderData) {
      res.status(404).json({ message: "No stakeholder found with this id!" });
      return;
    } else {
      await stakeholder.findByPk(req.params.id).then((results) => {results.update(req.body)})
    }
    res.status(200).json(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//delete a stakeholder; should only be done / usable from the Admin page
router.delete("/:id", async (req, res) => {
  try {
    const stakeholderData = await stakeholder.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!stakeholderData) {
      res.status(404).json({ message: "No stakeholder found with this id!" });
      return;
    }
    res.status(200).json(stakeholderData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
