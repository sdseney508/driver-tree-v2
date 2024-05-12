const router = require('express').Router();
const { status } = require('../../models');
const { Op } = require("sequelize");

// use /api/status
//create a status.  This should almost never be used
router.post('/', async (req, res) => {
  try {
    const statusData = await status.create();
    res.status(200).json(statusData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//get all statuss; this is used on the admin page to allow the admin to change a status
router.get('/', async (req, res) => {
    try {
        const statusData = await status.findAll();
        res.status(200).json(statusData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get specific status for future use
router.get('/:id', async (req, res) => {
    try {
        const statusData = await status.findByPk(req.params.id);
        res.status(200).json(statusData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update/change a status info      
router.put('/:id', async (req, res) => {
    try { 
        const statusData = await status.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!statusData) {
            res.status(404).json({ message: 'No status found with this id!' });
            return;
        }
        res.status(200).json(statusData);

    } catch (err) { 
        res.status(400).json(err);
    }

});

//delete a status.  This should almost never be used
router.delete('/:id', async (req, res) => {
    try {
        const statusData = await status.destroy({
            where: {
                id: req.params.id,
            },
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;