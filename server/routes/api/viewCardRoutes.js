const router = require("express").Router();
const { views, viewCards } = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/viewCards/ for all of these routes.  

//get all cards in a view
router.get("/viewCards/:id", async (req, res) => {
  try {
    const viewCardData = await viewCards.findAll({
      where: {
        viewId: req.params.id,
      },
    });
    res.status(200).json(viewCardData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get a specific viewCard.  Not sure where we'll use this yet, but it's here if we need it.
router.get("/:id", async (req, res) => {
  try {
    const viewCardData = await viewCards.findByPk(req.params.id);
    res.status(200).json(viewCardData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//add a new card to a view, this is done by creating a new viewCard and assigning it to a view
router.post("/new", async (req, res) => {
  try {
    //first create the view, the req.body needs to include  the viewId as views are tied between the two
    const viewCardData = await viewCards.create(req.body);
    res.status(200).json(viewCardData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//delete a driver from a view
router.delete("/delete/:viewId/:driverId", async (req, res) => {
  try {
    //delete from driver card from the model that has the viewId and driverId
    const viewCardData = await viewCards.destroy({
      where: {
        viewId: req.params.viewId,
        driverId: req.params.driverId,
      },
    });
    res.status(200).json(viewCardData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
