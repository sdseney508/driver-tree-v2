const router = require("express").Router();
const {
  outcomes,
  stakeholders,
  adminAudit,
  status,
  statusDefinition,
  drivers,
  clusters,
} = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/outcomes
//create new outcomes; also logs the creation in the admin poriton of the database
router.post("/new", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    //this is a transaction that also creates the admin log entry and the status definition entry
    const outcomesData = await outcomes.create(
       req.body,
      { transaction }
    );
    await adminAudit.create(
      {
        action: "Create",
        model: "outcomes",
        tableUid: outcomesData.id,
        fieldName: "All",
        newData: "created a new Outcome",
        oldData: "new Outcome",
        userId: req.body.userId,
      },
      { transaction }
    );

    //create the new status definitions, these are pulled from the status model and the definitions can be modified in the Legend section of the DriverTreePage
    let statuses = await status.findAll({transaction})

    for (let i = 0; i < statuses.length; i++) {

    await statusDefinition.create(
      {
        outcomeId: outcomesData.id,
        statusId: i + 1,
        statusDefinition: "New Outcome, please update me",
      },
      { transaction }
    );
    }
    await transaction.commit();
    res.status(200).json(outcomesData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//this route is only for database seeding and testing
router.post("/", async (req, res) => {
  try {
    const outcomesData = await outcomes.create(req.body);
    res.status(200).json(outcomesData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//get a specific outcome by id.  This will be used to populate the form
//after you select it from the table.
router.get("/getOne/:id", async (req, res) => {
  try {
    const outcomesData = await outcomes.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(outcomesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all outcomess for the outcomes table.  This data will be used to populate the table underneath the form view.
router.get("/", async (req, res) => {
  try {
    const outcomesData = await outcomes.findAll({
      include: [{ model: stakeholders }],
    });
    res.status(200).json(outcomesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all outcomes for a certain command
router.get("/command/:command", async (req, res) => {
  try {
    const outcomesData = await outcomes.findAll({
      where: {
        stakeholderId: req.params.command,
      },
    });
    res.status(200).json(outcomesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all active outcomes.  This data will be used to populate the table underneath the form view.
router.get("/active", async (req, res) => {
  try {
    const outcomesData = await outcomes.findAll({
      where: {
        olstat: "Active",
      },
    });
    res.status(200).json(outcomesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/draft", async (req, res) => {
  try {
    const outcomesData = await outcomes.findAll({ where: { olstat: "Draft" } });
    res.status(200).json(outcomesData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/retired", async (req, res) => {
  try {
    const outcomesData = await outcomes.findAll({
      where: { olstat: "Retired" },
    });
    res.status(200).json(outcomesData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


//update outcomes info
//TODO add in the call to update the admin log as well
router.put("/update/:id", async (req, res) => {
  try {
    const outcomesData = await outcomes.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!outcomesData) {
      res.status(404).json({ message: "No outcomes found with this id!" });
      return;
    }
    res.status(200).json(outcomesData);
    // console.log(outcomesData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete outcomes, this should only be used on the admin page
//TODO:  add in a call to note the action in the admin log table
router.delete("/:id", async (req, res) => {
  try {
    const outcomesData = await outcomes.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(outcomesData);
  } catch (err) {
    res.status(400).json(err);
  }
});


//get all drivers for an outcome
router.get("/driverByOutcome/:id", async (req, res) => {
  try {
    const outcomeDriverData = await outcomes.findAll({
      where: {
        id: req.params.id,
      },
      include: [{
        model: drivers,
        include: [{ model: clusters }] // Assuming 'drivers' model has the association to 'clusters'
      }]
    });
    res.status(200).json(outcomeDriverData);
  } catch (err) {
    res.status(400).json(err);
  }
});


module.exports = router;
