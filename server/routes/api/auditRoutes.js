const router = require('express').Router();
const { audit } = require('../../models');
const sequelize = require("../../config/connection");

// use /api/audits


router.post('/', async (req, res) => {
    try {
        const auditData = await audit.create(req.body);
        res.status(200).json(auditData);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
    });

//get all audits
router.get('/', async (req, res) => {
    try {
        const auditData = await audit.findAll();
        res.status(200).json(auditData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get specific audit for future use
router.get('/:id', async (req, res) => {
    try {
        const auditData = await audit.findByPk(req.params.id);
        res.status(200).json(auditData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//update/change an audit info
router.put('/:id', async (req, res) => {
    try {
        const auditData = await audit.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!auditData) {
            res.status(404).json({ message: 'No audit found with this id!' });
            return;
        }
        res.status(200).json(auditData);

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

});

//delete an audit.  this should never be used except by the overarching Super User account to clean up the database.
router.delete('/:id', async (req, res) => {
    try {
        const auditData = await audit.destroy({
            where: {
                id: req.params.id,
            },
        });
        if (!auditData) {
            res.status(404).json({ message: 'No audit found with this id!' });
            return;
        }
        res.status(200).json(auditData);

    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }

});

module.exports = router;