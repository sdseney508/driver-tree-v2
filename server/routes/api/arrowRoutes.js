const router = require("express").Router();
const { arrows, outcomes } = require("../../models");
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

//use /api/arrows

//create a new arrow, this gets called from driverTreePage.js when you click on the create arrow button.  The button will ask the user to select two cards then will draw the arrow between them.
router.post("/new", async (req, res) => {
  try {
    if (req.body.id) {
      delete req.body.id;
    }
    const arrowData = await arrows.create(req.body);
    res.status(200).json(arrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//gets all of the arrows for an outcome.  This is used on loading the driver tree page to draw all of the arrows for the outcome.
router.get("/outcomeID/:id", async (req, res) => {
  try {
    const arrowData = await arrows.findAll({
      where: {
        outcomeId: req.params.id,
      },
    });
    res.status(200).json(arrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//used to find an arrow based on an attached driver
router.get("/find/:id/:outcomeId", async (req, res) => {
  try {
    const arrowData = await arrows.findAll({
      where: {
        outcomeId: req.params.outcomeId,
        [Op.and]: [
          {
            [Op.or]: [{ start: req.params.id }, { end: req.params.id }],
          },
        ],
      },
    });
    console.log(arrowData);
    res.status(200).json(arrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get a single arrow to modify its properties via the modal that will appear during an on click event.
router.get("/:id", async (req, res) => {
  try {
    const arrowData = await arrows.findByPk(req.params.id);
    res.status(200).json(arrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

router.get("/", async (req, res) => {
  try {
    const arrowData = await arrows.findAll({
      raw:true,
      include: [{ model: outcomes, attributes: ["outcomeTitle"]}],
    });
    res.status(200).json(arrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//modify the arrow properties, this gets called from driverTreePage.js when you click on the arrow itself, it will open up a modal that has drop downs for arrow properties which then get saved to the width, color, and line type fields in the arrow table.
router.put("/update/:id", async (req, res) => {
  try {
    console.log(req.body);
    const arrowData = await arrows.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(arrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//deletes an arrow
router.delete("/delete/:id", async (req, res) => {
  try {
    const arrowData = await arrows.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(arrowData);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;
