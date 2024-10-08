const router = require("express").Router();
const { clusters, drivers, outcomeDrivers, adminAudit } = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/cluster/ for all of these routes.  Uses the driver table for the create to make sure the link is maintained between driver and cluster that it is in.

router.get("/:id", async (req, res) => {
  try {
    const clusterData = await clusters.findByPk(req.params.id);
    res.status(200).json(clusterData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//create a new cluster;
router.post("/new", async (req, res) => {
  // const transaction = await sequelize.transaction();
  try {
    //first create the cluster, the req.body needs to include the outcomeID and the driverID
    const clusterData = await clusters.create(
      { outcomeId: req.body.outcomeId, clusterName: req.body.clusterName }
    );
    //the below code doesnt work with any transactions
    for (let i = 0; i < req.body.selDriversArr.length; i++) {
      let tempId;
      if (req.body.selDriversArr[i].driverId) {
        tempId = req.body.selDriversArr[i].driverId;
      } else {
        tempId = req.body.selDriversArr[i].id;
      }

      await drivers.update(
        { clusterId: clusterData.dataValues.id },
        {
          where: {
            id: tempId,
          },
        }
      );

      //update the subTier on the outcomeDriver
      await outcomeDrivers.update(
        { subTier: req.body.selDriversArr[i].subTier },
        {
          where: {
            outcomeId: req.body.outcomeId,
            driverId: tempId,
          },
        }
      );
    }
    res.status(200).json(clusterData);

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//create all the new clusters for a new outcome
router.post("/bulkCreate", async (req, res) => {
  try {
    //first create the cluster, the req.body needs to include the outcomeID and the driverID
    const clusterData = await clusters.bulkCreate(req.body);
    res.status(200).json(clusterData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//update a cluster
router.put("/update/:id", async (req, res) => {
  try {
    const clusterData = await clusters.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(clusterData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete cluster
//TODO:  make sure you put an "Are you sure" prompt and only let this be done
router.delete("/:id", async (req, res) => {
  try {
    //delete from clusters model
    const clusterData = await clusters.destroy({
      where: {
        id: req.params.id,
      },
    });

    //update the drivers model
    const driversData = await drivers.update(
      { clusterId: null },
      {
        where: {
          clusterId: req.params.id,
        },
      }
    );

    res.status(200).json(clusterData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
