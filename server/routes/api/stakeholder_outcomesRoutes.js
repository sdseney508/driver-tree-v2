const router = require("express").Router();
const { stakeholder_outcomes, stakeholder } = require("../../models");
const { signToken } = require("../../utils/auth");

//import middleware
// put authMiddleware anywhere we need to send a token for verification of user. this will maintain their login for up to 2 hours.
const { authMiddleware } = require("../../utils/auth");
const secret = "drivertree";
const expiration = "2h";
// use /api/stakeholder_outcomes for all the axios calls

//gets all stakeholder_outcomes.  Not sure what this will be used for yet
router.get("/", async (req, res) => {
  try {
    const stakeholderData = await stakeholder_outcomes.findAll();
    res.status(200).json(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get a stakeholder_outcome combo by OutcomeID.  This will be used to propulate the legend on the driverTreePage.js.
router.get("/byOutcome/:id", async (req, res) => {
  try {
    const stakeholder = await stakeholder_outcomes.findOne({
      where: {
        outcome_id: req.params.id,
      },
    });

    if (!stakeholder) {
      return res
        .status(400)
        .json({ message: "Cannot find a stakeholder for this Outcome!" });
    }
    res.status(200).send(stakeholder);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//create a stakeholder outcome combo; the body requires the stakeholder id and the outcome id
router.post("/", async (req, res) => {
  try {
    const stakeholderData = await stakeholder_outcomes.create(req.body);
    res.status(200).json(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update stakeholder info
router.put("/:id", async (req, res) => {
  try {
    const stakeholderData = await stakeholder_outcomes.findOne({
      where: {
        outcome_id: req.params.id,
        stakeholder: req.body.stakeholder,
      },
    });
    if (!stakeholderData) {
      res.status(404).json({ message: "No stakeholder found for this Outcome" });
      return;
    } else {
      await stakeholder_outcomes.findOne({
        where: {
          outcome_id: req.params.id,
          stakeholder: req.body.stakeholder,
        },
      }).then((results) => {
        results.update(req.body);
      });
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
    const stakeholderData = await stakeholder_outcomes.destroy({
      where: {
        id: req.params.id,
        stakeholder: req.body.stakeholder,
      },
    });
    if (!stakeholderData) {
      res.status(404).json({ message: "No stakeholder found for this Outcome!" });
      return;
    }
    res.status(200).json(stakeholderData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
