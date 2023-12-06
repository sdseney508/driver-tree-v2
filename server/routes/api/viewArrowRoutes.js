const router = require("express").Router();
const { views, viewArrows } = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/viewArrows/ for all of these routes.  Uses the driver table for the create to make sure the link is maintained between driver and cluster that it is in.

//get all arrows in a view
router.get("/viewArrows/:id", async (req, res) => {
  try {
    const viewArrowData = await viewArrows.findAll({
      where: {
        viewId: req.params.id,
      },
    });
    res.status(200).json(viewArrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get a specific viewArrow.  Not sure where we'll use this yet, but it's here if we need it.
router.get("/:id", async (req, res) => {
  try {
    const viewArrowData = await viewArrows.findByPk(req.params.id);
    res.status(200).json(viewArrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//add all the arrows to a view that originated from a driver card, this is done and assigning them to a view
router.post("/new", async (req, res) => {
  try {
    //first check to see if the arrow is already in the view, if it is, do nothing, otherwise add it
    const viewArrowData = await viewArrows.findAll({
      where: {
        viewId: req.body.viewId,
        arrowId: req.body.arrowId,
      },
    });
    if (viewArrowData.length > 0) {
      res.status(200).json(viewArrowData);
    } else {
      const viewArrowData = await viewArrows.create(req.body);
      res.status(200).json(viewArrowData);
    }
  } catch (err) {
    res.status(400).json(err);
  }
});



//delete all the arrows starting from a driver card that was removed from a view
router.delete("/delete/:viewId/:arrowId", async (req, res) => {
  try {
    //first check to see if the arrow is eve in the view, if it is delete it, otherwise do nothing.
    console.log(req.params.viewId, req.params.arrowId);
    const viewArrowData = await viewArrows.findAll({
      where: {
        viewId: req.params.viewId,
        arrowId: req.params.arrowId,
      },
    });
    console.log(viewArrowData.length);
    if (viewArrowData.length > 0) {
      const viewArrowData = await viewArrows.destroy({
        where: {
          viewId: req.params.viewId,
          arrowId: req.params.arrowId,
        },
      });
      res.status(200).json(viewArrowData);
    } else {
      //do nothing
      console.log("arrow not in view");
      res.status(200).json("arrow not in view");
    }
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
