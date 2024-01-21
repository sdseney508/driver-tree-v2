const router = require("express").Router();
const { drivers, clusters, adminAudit } = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/drivers
//create a new drivers; 
router.post("/new/:userId", async (req, res) => {
  let driversData = [];
  const transaction = await sequelize.transaction();
  try {
    //first check for the highest subTier number under a tier and
    //outcome and increment it by 1
    let subTier = await drivers.max("subTier", {
      where: {
        tierLevel: req.body.tierLevel,
        outcomeId: req.body.outcomeId,
      },
    });
    let body = req.body;
    body.subTier = subTier + 1;
    driversData = await drivers.create(req.body, 
      {
      transaction
    });
    await adminAudit.create({
      action: "Create",
      model: "drivers",
      tableUid: driversData.id,
      fieldName: "All",
      newData: JSON.stringify(driversData),
      oldData: "new Driver",
      userId: req.params.userId,
    },
    {transaction}
    );
    await transaction.commit();
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
    const driversData = await drivers.findAll({
      include: [{model: clusters}],
    });
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all active driverss for the drivers table. This data will be used to populate the table underneath the form view.
router.get("/byoutcome/:id", async (req, res) => {
  try {
    //the id is the outcome id, not the driver id, this does not return a driver, it returns the drivers for an outcome joined with the cluster information
    const driversData = await drivers.findAll({
      include: [{
          model: clusters
        },
      ],
      where: {
        outcomeId: req.params.id,
      },
    });
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//this gets all the drivers with the same cluster for use in the cascadeUpdate function
router.get("/byCluster/:id", async (req, res) => {
  try {
    const driversData = await drivers.findAll({
      where: {
        clusterId: req.params.id,
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
        outcomeId: req.params.id,
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
        outcomeId: req.params.id,
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
router.put("/update/:id/:userId", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const oldData = await drivers.findOne({
      where: {
        id: req.params.id,
      },
    });
    if (!oldData) {
      res.status(404).json({ message: "No drivers found with this id!" });
      return;
    }
    const driversData = await drivers.update(req.body, {
      where: {
        id: req.params.id,
      },
      transaction,
    });

    await adminAudit.create({
      action: "Update",
      model: "drivers",
      tableUid: req.params.id,
      fieldName: "All",
      newData: JSON.stringify(req.body),
      oldData: JSON.stringify(oldData),
      userId: req.params.userId,
    },
    {transaction}
    );
    await transaction.commit();

    res.status(200).json(driversData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//bulk update of driver status
router.put("/bulkUpdate", async (req, res) => {
  try {
    const driversData = await drivers.update(req.body, {
      where: {
        id: {
          [Op.or]: req.body.ids,
        },
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
