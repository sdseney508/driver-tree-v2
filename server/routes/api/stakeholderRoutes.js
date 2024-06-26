const router = require("express").Router();
const { stakeholders } = require("../../models");

// use /api/stakeholders for all the axios calls

//get a specific stakeholder.  will be used by the admin page to fill in the react table.  When he selects a specific user, the id of the selected user will be passed to the get /:id route
router.get("/:id", async (req, res) => {
  try {
    const stakeholderData = await stakeholders.findByPk(req.params.id);
    res.status(200).json(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get all stakeholders; used for account creation form
router.get("/", async (req, res) => {
  try {
    const stakeholderData = await stakeholders.findAll();
    res.status(200).json(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//create a stakeholder
router.post("/", async (req, res) => {
  try {
    const stakeholderData = await stakeholders.create(req.body);
    res.status(200).json(stakeholderData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//update stakeholder info
router.put("/update/:id", async (req, res) => {
  try {
    console.log(req.body);
    const stakeholderData = await stakeholders.update(req.body, {
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
    console.log(err);
    res.status(400).json(err);
  }
});

//delete a stakeholder; should only be done / usable from the Admin page
router.delete("/:id", async (req, res) => {
  try {
    const stakeholderData = await stakeholders.destroy({
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
