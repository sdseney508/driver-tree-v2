const router = require('express').Router();
const { arrows } = require('../../models');

// use /api/audits


//create a new arrow, this gets called from driverTreePage.js when you click on the create arrow button.  The button will ask the user to select two cards then will draw the arrow between them.
router.post('/new', async (req, res) => {
    try {
        const arrowData = await arrow.create(req.body);
        res.status(200).json(arrowData);
    } catch (err) {
        res.status(400).json(err);
    }
});


//modify the arrow properties, this gets called from driverTreePage.js when you click on the arrow itself, it will open up a modal that has drop downs for arrow properties which then get saved to the width, color, and line type fields in the arrow table.
router.put('/update/:id', async (req, res) => {
    try {
        const arrowData = await arrow.update(req.body, {
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
router.delete('/delete/:id', async (req, res) => {
    try {
        const arrowData = await arrow.destroy({
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