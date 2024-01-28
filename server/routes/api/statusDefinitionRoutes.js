const router = require('express').Router();
const { statusDefinition } = require('../../models');
const { Op } = require("sequelize");

// use /api/statusDefinition
//create a statusDefinition.  This should almost never be used
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const statusDefData = await statusDefinition.create(req.body);
    res.status(200).json(statusDefData);
  } catch (err) {
    res.status(400).json(err);
  }
});

//get all statusDef's; this is used on the admin page to allow the admin to change a statusDefinition
router.get('/', async (req, res) => {
    try {
        const statusDefData = await statusDefinition.findAll();
        res.status(200).json(statusDefData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get all the statusDef's for a specific outcome.  This is used to populate the legend on the drivertreepage
router.get('/byOutcome/:id', async (req, res) => {
    try {
        const statusDefData = await statusDefinition.findAll({
            where: {
                outcomeId: req.params.id,
            },
        });
        res.status(200).json(statusDefData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get specific statusDefinition for future use
router.get('/:id', async (req, res) => {
    try {
        const statusDefData = await statusDefinition.findByPk(req.params.id);
        res.status(200).json(statusDefData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update/change a statusDefinition info      
router.put('/:id', async (req, res) => {
    try { 
        console.log(req.body);
        console.log(req.params.id);
        const statusDefData = await statusDefinition.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        console.log(statusDefData);
        if (!statusDefData) {
            res.status(404).json({ message: 'No status found with this id!' });
            return;
        }
        res.status(200).json(statusDefData);

    } catch (err) { 
        res.status(400).json(err);
    }

});

//delete a statusDefinition.  This should almost never be used
router.delete('/:id', async (req, res) => {
    try {
        const statusDefData = await statusDefinition.destroy({
            where: {
                id: req.params.id,
            },
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;