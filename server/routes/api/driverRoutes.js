const router = require("express").Router();
const {
  drivers,
  clusters,
  adminAudit,
  outcomes,
  outcomeDrivers,
  arrows,
} = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/drivers
//create a new driver; the body needs to include the outcomeId and the tierLevel
router.post("/new/:userId", async (req, res) => {
  let body = JSON.parse(JSON.stringify(req.body));
  //now change the body.outcomeId to 0 so that the new driver is not linked to the old outcome
  delete body.id;
  const transaction = await sequelize.transaction();
  try {
    //since this function is used to in both the single create new driver and in the create a new outcome revision, we need to check if the driver subTier already exists, if it doesnt, then we append it to the req.bdy, otherwise we use the subTier that is already in the req.body
    console.log(req.body.subTier);
    if (!req.body.subTier) {
      //get the correct subTier for the new driver
      let subTier = await outcomeDrivers.max("subTier", {
        where: {
          tierLevel: req.body.tierLevel,
          outcomeId: req.body.outcomeId,
        },
      });

      //create a deep copy of the req.body so i can mod it without changing the original

      body.outcomeId = 0;
      body.subTier = subTier + 1;
      const driversData = await drivers.create(body, {
        transaction,
      });
      const outdriver = await outcomeDrivers.create(
        {
          outcomeId: req.body.outcomeId,
          driverId: driversData.id,
          tierLevel: req.body.tierLevel,
          subTier: body.subTier,
        },
        { transaction }
      );
      await adminAudit.create(
        {
          action: "Create",
          model: "drivers",
          tableUid: driversData.id,
          fieldName: "All",
          newData: JSON.stringify(driversData.dataValues),
          oldData: "new Driver",
          userId: req.params.userId,
        },
        { transaction }
      );
      try {
        await transaction.commit();
        res.status(200).json(driversData);
      } catch (commitError) {
        console.error("Commit Error:", commitError);
        await transaction.rollback();
        res
          .status(500)
          .json({ message: "Transaction commit failed", error: commitError });
        return; // Ensure further execution is stopped
      }
    } else {
      console.log("subTier exists");
      delete req.body.id;
      const driversData = await drivers.create(req.body, { transaction });
      console.log(req.body.subTier);
      await outcomeDrivers.create(
        {
          outcomeId: req.body.outcomeId,
          driverId: driversData.id,
          tierLevel: req.body.tierLevel,
          subTier: req.body.subTier,
        },
        { transaction }
      );
      const auditres = await adminAudit.create(
        {
          action: "Create",
          model: "drivers",
          tableUid: driversData.id,
          fieldName: "All",
          newData: JSON.stringify(driversData),
          oldData: "new Driver",
          userId: req.params.userId,
        },
        { transaction }
      );
      try {
        await transaction.commit();
        res.status(200).json(driversData);
      } catch (commitError) {
        console.error("Commit Error:", commitError);
        await transaction.rollback();
        res
          .status(500)
          .json({ message: "Transaction commit failed", error: commitError });
        return; // Ensure further execution is stopped
      }
    }
  } catch (err) {
    console.error("Transaction Error:", err);
    await transaction.rollback();
    res.status(400).json(err);
  }
});

//this is used to create a new version of an Outcome Tree
router.post("/bulkCreate", async (req, res) => {
  try {
    const driversData = await drivers.bulkCreate(req.body);
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
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all drivers for the drivers table.  This data will be used to populate the table underneath the form view.
router.get("/", async (req, res) => {
  try {
    const driversData = await drivers.findAll({
      include: [{ model: clusters }],
    });
    res.status(200).json(driversData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//get all driverss for the by an outcome. This data will be used to populate the table underneath the form view and to populate the driverTreeObj
router.get("/byoutcome/:id", async (req, res) => {
  //get all drivers for an outcome
  //include the arrows too
  try {
    const outcomeDriverData = await outcomes.findAll({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: drivers,
          include: [
            {
              model: clusters,
            },
          ],
        },
        {
          model: arrows,
        },
      ],
    });

    // Map over the fetched data to flatten the structure
    const flattenedData = outcomeDriverData.map((outcome) => {
      // Assuming outcome.drivers is an array and you want to flatten each driver's data
      return outcome.drivers.map((driver) => {
        return {
          ...driver.dataValues, // Spread all driver properties
          ...driver.outcomeDrivers.dataValues, // Flatten outcomeDrivers properties into the same level
          cluster: driver.cluster ? driver.cluster.dataValues : null, // Include cluster data if available
          // arrows: outcome.arrows, // Include arrows data
        };
      });
    });

        // Group by tierLevel
        const groupedByTier =[]
        for (let i = 0; i < flattenedData[0].length; i++) {
          // Use driver.tierLevel as the key for grouping
          const tier = flattenedData[0][i].tierLevel;
          if (!groupedByTier[tier]) {
            groupedByTier[tier] = [];
          }
          groupedByTier[tier].push(flattenedData[0][i]);  
        }    
    res.status(200).json(groupedByTier);
  } catch (err) {
    res.status(400).json(err);
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

router.put("/clusterUpdate/:id", async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    req.body.modified = "Yes";
    const driversData = await drivers.update(req.body, {
      where: {
        cluster: req.params.id,
      },
    });
    if (!driversData) {
      res.status(404).json({ message: "No clusters found with this id!" });
      return;
    }
    await adminAudit.create(
      {
        action: "Update",
        model: "drivers",
        tableUid: req.params.id,
        fieldName: "All",
        newData: JSON.stringify(req.body),
        oldData: JSON.stringify(oldData),
        userId: req.params.userId,
      },
      { transaction }
    );
    await transaction.commit();
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
    if (!req.body.modified) {
      req.body.modified = "Yes";
    }
    const driversData = await drivers.update(req.body, {
      where: {
        id: req.params.id,
      },
      transaction,
    });
    await adminAudit.create(
      {
        action: "Update",
        model: "drivers",
        tableUid: req.params.id,
        fieldName: "All",
        newData: JSON.stringify(req.body),
        oldData: JSON.stringify(oldData),
        userId: req.params.userId,
      },
      { transaction }
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
