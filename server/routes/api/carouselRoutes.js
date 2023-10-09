const router = require("express").Router();
const { carousel } = require("../../models");
const { signToken } = require("../../utils/auth");

//import middleware
// put authMiddleware anywhere we need to send a token for verification of user. this will maintain their login for up to 2 hours.
//need to put in authMiddleware after testing is complete
const { authMiddleware } = require("../../utils/auth");
const secret = "oplimits";
const expiration = "2h";
// // use /api/carousel for all the axios calls

// //get a specific carousl.  will be used by the admin page by the updateCarousel function
router.get("/:id",  async (req, res) => {
  try {
    const carouselData = await carousel.findByPk(req.params.id);
    res.status(200).json(carouselData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//get all of the carousels.  This will be used to fill in the carousel cards on the AdminCarouselMangementPage.  used by the getCarousel function
router.get("/",  async (req, res) => {
  try {
    const carouselData = await carousel.findAll();
    res.status(200).send(carouselData);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
});

//create a new carousel.  This will be used by the AdminCarouselManagementPage
router.post("/",  async (req, res) => {
  try {
    const carouselData = await carousel.create(req.body);
    res.status(200).json(carouselData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//using a post route with an id to post the image
router.post("/:id",  async (req, res) => {
  try {
    console.log("in the post route with id")
    console.log(req.body);
    const carouselData = await carousel.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(carouselData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//update a carousel item by its id.  The id will be read from the card on the carousel admin page.  This will be used by the AdminCarouselManagementPage
router.put("/:id",  async (req, res) => {
  try {
    console.log(req.body);
    console.log(req.params.id);
    const carouselData = await carousel.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if (!carouselData) {
      res.status(404).json({ message: "No carousel found with this id!" });
      return;
    }
    console.log(carouselData);
    res.status(200).json(carouselData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


//delete a carousel.  This will be used by the AdminCarouselManagementPage when we want to delete a carousel item
router.delete("/:id",  async (req, res) => { 
  try {
    const carouselData = await carousel.destroy({
      where: {
        id: req.params.id,
      },
    });
    if (!carouselData) {
      res.status(404).json({ message: "No carousel found with this id!" });
      return;
    }
    res.status(200).json(carouselData);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});


module.exports = router;
