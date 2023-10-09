const router = require("express").Router();
const { drivers } = require("../../models");
const sequelize = require("../../config/connection");
const {Op} = require("sequelize");

// use /api/drivers
//create a new drivers; 
router.post("/new", async (req, res) => {
  try {
    const driversData = await drivers.create({outcomeID: req.body.outcomeID});
    let id = driversData.id;
    const ol = await drivers.update(
      { admin_log: req.body.log },
      {
        where: {
          id: id, 
        },
      }
    );
    res.status(200).json(driversData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//this route is only for database seeding and testing
router.post("/", async (req, res) => {
  try {
    const driversData = await drivers.create(req.body);
    res.status(200).json(driversData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//get a specific driver by id.  This will be used to populate the form
//after you select it from the table.
router.get("/getOne/:id", async (req, res) => {
  try {
    console.log(req.params.id);
    const driversData = await drivers.findOne({
      where: {
        id: req.params.id,
      },
    });
    console.log(driversData);
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});


//get all drivers for the drivers table.  This data will be used to populate the table underneath the form view.
router.get("/", async (req, res) => {
  try {
    const driversData = await drivers.findAll();
    console.log(driversData);
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all active driverss for the drivers table. This data will be used to populate the table underneath the form view.
router.get("/byoutcome/:id", async (req, res) => {
  try {
    const driversData = await drivers.findAll({
      where: {
        outcomeID: req.params.id,
      },
    });
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/draft", async (req, res) => {
  try {
    const driversData = await drivers.findAll({ where: { olstat: "Draft" } });
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/retired", async (req, res) => {
  try {
    // console.log("i started the get to sign route");
    const driversData = await drivers.findAll({ where: { olstat: "Retired" } });
    res.status(200).json(driversData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//append the admin log with what was changed
router.put("/adminlog/:id", async (req, res) => {
  try {
    let comment = req.body.log;
    console.log(typeof(comment));
    console.log(comment.admin_log);
    await sequelize.query(
      "update drivers set admin_log = concat(admin_log, :adminLog) where id = :id",
      {
        replacements: {
          adminLog: req.body.log.admin_log,
          id: req.params.id,
        },
      }
    );
    res.status(200).json({ message: "Admin Log Updated" });
  } catch (err) {
    console.log(err);
    res.status(401).json(err);
  }
});

//update drivers info
router.put("/update/:id", async (req, res) => {
  try {
    const driversData = await drivers.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!driversData) {
      res.status(404).json({ message: "No drivers found with this id!" });
      return;
    }
    res.status(200).json(driversData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete drivers
//TODO:  make sure you put an "Are you sure" prompt and only let this be done to an outcome marked as Draft, button should disappear if it is not draft.when it goes ACtive or Retired
router.delete("/:id", async (req, res) => {
  try {
    const driversData = await drivers.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(driversData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
