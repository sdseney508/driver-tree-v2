const router = require('express').Router();
const { classification } = require('../../models');

// use /api/classification
//create a classification.  This should almost never be used outside of the admin page
router.post('/', async (req, res) => {
  try {
    const classifictionData = await classification.create();
    res.status(200).json(classificationData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//get all classifications; this is used on the driver page to select the classificaiton of a driver.  The classification of an outcome is based on the highest level classification of all the drivers.
router.get('/', async (req, res) => {
    try {
        const classificationData = await classification.findAll();
        res.status(200).json(classificationsData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get specific classifcition for future use.  Not accessible by users, only by an admin
router.get('/:id', async (req, res) => {
    try {
        const classificationData = await classification.findByPk(req.params.id);
        res.status(200).json(classificationData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update/change a classification info; only accessible via the admin page; no user has access to this route.      
router.put('/:id', async (req, res) => {
    try { 
        const classificationData = await classification.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!classificationData) {
            res.status(404).json({ message: 'No classification found with this id!' });
            return;
        }
        res.status(200).json(classificationData);

    } catch (err) { 
        res.status(400).json(err);
    }

});

//delete a classification.  This should almost never be used; only accessible to an admin
router.delete('/:id', async (req, res) => {
    try {
        const classificationData = await classification.destroy({
            where: {
                id: req.params.id,
            },
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;