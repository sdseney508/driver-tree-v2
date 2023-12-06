const router = require("express").Router();
const { views } = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/views/ for all of these routes.  Uses the driver table for the create to make sure the link is maintained between driver and cluster that it is in.

//get all views for a specific user for a specific outcome.  This populates the views table for an outcome on the driver tree page.
router.get("/userByOutcome/:userId/:outcomeId", async (req, res) => {
  try {
      const viewData = await views.findAll({
      where: {
        userId: req.params.userId,
        outcomeId: req.params.outcomeId,
      },
    });
    res.status(200).json(viewData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get a specific view.  Not sure where we'll use this yet, but it's here if we need it.
router.get("/:id", async (req, res) => {
  try {
    const viewData = await views.findByPk(req.params.id);
    res.status(200).json(viewData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//create a new view; the req.body 
router.post("/new", async (req, res) => {
  try {
    //first create the view, the req.body needs to include the outcomeID, the userID, and the view name as views are tied between the two
    const viewData = await views.create(req.body);
    res.status(200).json(viewData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//update a view.  Can only change the name of the view as the userID and outcomeID are tied to the view as unique identifiers
router.put("/update/:id", async (req, res) => {
  try {
    const viewData = await views.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(viewData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//delete view
router.delete("/:id", async (req, res) => {
  try {
    //delete from views model
    const viewData = await views.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json(viewData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
