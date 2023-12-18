const router = require('express').Router();
const { adminAudit } = require('../../models');
const sequelize = require("../../config/connection");
const { Op } = require("sequelize");

// use /api/adminaudits


module.exports = router;

router.post('/', async (req, res) => {
    try {
        const adminAuditData = await adminAudit.create(req.body);
        res.status(200).json(adminAuditData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
    });

//get all adminAudits
router.get('/', async (req, res) => {
    try {
        const adminAuditData = await adminAudit.findAll();
        res.status(200).json(adminAuditData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get specific adminAudit for future use
router.get('/:id', async (req, res) => {
    try {
        const adminAuditData = await adminAudit.findByPk(req.params.id);
        res.status(200).json(adminAuditData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//update/change a adminAudit info
router.put('/:id', async (req, res) => {
    try {
        const adminAuditData = await adminAudit.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!adminAuditData) {
            res.status(404).json({ message: 'No adminAudit found with this id!' });
            return;
        }
        res.status(200).json(adminAuditData);

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

});

//delete a adminAudit
router.delete('/:id', async (req, res) => {
    try {
        const adminAuditData = await adminAudit.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!adminAuditData) {
            res.status(404).json({ message: 'No adminAudit found with this id!' });
            return;
        }
        res.status(200).json(adminAuditData);

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

});

module.exports = router;
