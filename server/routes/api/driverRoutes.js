const router = require("express").Router();
const { drivers } = require("../../models");
const sequelize = require("../../config/connection");
const {Op} = require("sequelize");

// use /api/drivers
//create a new drivers; 
router.post("/new", async (req, res) => {
  try {
    //first check for the highest subTier number under a tier and
    //outcome and increment it by 1
    let subTier = await drivers.max("subTier", {
      where: {
        tierLevel: req.body.tierLevel,
        outcomeID: req.body.outcomeID,
      },
    });
    let body = req.body;
    body.subTier = subTier + 1;
    console.log(body);
    const driversData = await drivers.create(req.body);
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

//get the stakeholders and abbreviations for all drivers for an outcome
router.get("/stakeholders/:id", async (req, res) => {
  try {
    const driversData = await drivers.findAll({
      attributes: ["stakeholders", "stakeholderAbbreviation"],
      where: {
        outcomeID: req.params.id,
      },
    });
    console.log(driversData);
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all drivers in a tier for an outcome
router.get("/byOutcomeByTier/:id", async (req, res) => {
  try {
    const driversData = await drivers.findAll({
      where: {
        outcomeID: req.params.id,
        tierLevel: req.body.tierLevel,
      },
    });
    res.status(200).json(driversData);
  } catch (err) {
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

router.put("/clusterUpdate/:id", async (req, res) => {
  try {
    const driversData = await drivers.update(req.body, {
      where: {
        cluster: req.params.id,
      },
    });
    if (!driversData) {
      res.status(404).json({ message: "No clusters found with this id!" });
      return;
    }
    res.status(200).json(driversData);
  } catch (err) {
    res.status(400).json(err);
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

//gets the highest cluster number for a tier of drivers.  looks for the highest number in the cluster column and increments it by 1 and returns the new value
router.get("/cluster/", async (req, res) => {
  try {
    //first check for the highest subTier number under a tier and
    //outcome and increment it by 1
    let clust = await drivers.findAll({
      attributes: [[sequelize.fn("max", sequelize.col("cluster"))]],
      where: {
        tierLevel: req.body.tierLevel,
        outcomeID: req.body.outcomeID,
      },
    });
    res.status(200).json(clust);
  } catch (err) {
    res.status(401).json(err);
  }
});

//delete drivers
//TODO:  make sure you put an "Are you sure" prompt and only let this be done to an outcome marked as Draft, button should disappear if it is not draft.  When it goes ACtive or Retired
router.delete("/:id", async (req, res) => {
  try {
    console.log("in the delete driver route, id: "+req.params.id);
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
