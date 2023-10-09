const router = require('express').Router();
const { accountStatus } = require('../../models');

// use /api/accountStatus
//create a status.  This should almost never be used
router.post('/', async (req, res) => {
  try {
    console.log(req.body);
    const accountStatusData = await accountStatus.create(req.body);

  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//get all status's; this is used on the admin page to allow the admin to change a user's account status
router.get('/', async (req, res) => {
    try {
        const accountStatusData = await accountStatus.findAll();
        console.log(accountStatusData);
        res.status(200).json({accountStatusData});
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get specific accountStatus for future use
router.get('/:id', async (req, res) => {
    try {
        const accountStatusData = await accountStatus.findByPk(req.params.id);
        res.status(200).json(accountStatusData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//update/change a status info      
router.put('/:id', async (req, res) => {
    try { 
        const accountStatusData = await accountStatus.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!accountStatusData) {
            res.status(404).json({ message: 'No status found with this id!' });
            return;
        }
        res.status(200).json(accountStatusData);

    } catch (err) { 
        console.log(err);
        res.status(400).json(err);
    }

});

//delete a status.  This should almost never be used
router.delete('/:id', async (req, res) => {
    try {
        const accountStatusData = await accountStatus.destroy({
            where: {
                id: req.params.id,
            },
        });
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;