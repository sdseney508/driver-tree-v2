const router = require("express").Router();
const { outcomeDrivers, drivers, adminAudit } = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/outcomeDrivers/ for all of these routes.  Uses the driver table for the create to make sure the link is maintained between driver and cluster that it is in.

//get all drivers for an outcome
router.get("/driverByOutcome/:id", async (req, res) => {
  try {
    const outcomeDriverData = await outcomeDrivers.findAll({
      where: {
        outcomeId: req.params.id,
      },
      include: [{ model: drivers }],
    });
    res.status(200).json(outcomeDriverData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get a specific outcomeDriver.  Not sure where we'll use this yet, but it's here if we need it.
router.get("/:id", async (req, res) => {
  try {
    const outcomeDriverData = await outcomeDrivers.findByPk(req.params.id);
    res.status(200).json(outcomeDriverData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//update a driver for an outcome;
router.put("/update/:outcomeId/:driverId/:userId", async (req, res) => {
  console.log(req.body);
  const transaction = await sequelize.transaction();
  try {
    await outcomeDrivers.update(req.body, {
      where: {
        outcomeId: req.params.outcomeId,
        driverId: req.params.driverId,
      },
    });
    const outcomeDriverData = await outcomeDrivers.findOne({
      where: {
        outcomeId: req.params.outcomeId,
        driverId: req.params.driverId,
      },
    });
    console.log(outcomeDriverData.dataValues.id);
    const auditData = await adminAudit.create(
      {
        action: "Update",
        model: "outcomeDrivers",
        tableUid: outcomeDriverData.dataValues.id,
        fieldName: "All",
        newData: JSON.stringify(req.body),
        oldData: JSON.stringify(outcomeDriverData.dataValues),
        userId: req.params.userId,
      },
      { transaction }
    );
    console.log(auditData);
    await transaction.commit();

    res.status(200).json(outcomeDriverData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//create a new driver for an outcome, this is done by creating a new outcomeDriver and assigning it to a outcome
router.post("/new", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    let subTier;
    let tierLevel;
    //first create the outcome, the req.body needs to include the outcomeId and the driverId
    if (!req.body.subTier) {
      subTier = await outcomeDrivers.max("subTier", {
        where: {
          tierLevel: req.body.tierLevel,
          outcomeId: req.body.outcomeId,
        },
      });
      body.subTier = subTier + 1;
    } else {
      subTier = req.body.subTier;
    }
    let body = req.body;
    
    console.log(body);
    const outcomeDriverData = await outcomeDrivers.create(body, {
      transaction,
    });

    await adminAudit.create(
      {
        action: "Create",
        model: "outcomeDrivers",
        tableUid: outcomeDriverData.id,
        fieldName: "All",
        newData: JSON.stringify(outcomeDriverData),
        oldData: "new Outcome Driver",
        userId: req.body.userId,
      },
      { transaction }
    );
    await transaction.commit();

    res.status(200).json(outcomeDriverData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete a driver from an outcome
router.delete("/delete/:outcomeId/:driverId", async (req, res) => {
  try {
    //delete from driver card from the model that has the viewId and driverId
    const driverData = await outcomeDrivers.destroy({
      where: {
        outcomeId: req.params.outcomeId,
        driverId: req.params.driverId,
      },
    });
    res.status(200).json(driverData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
