const express = require('express');
const router = require('express').Router();
const { adminAudit } = require('../../models');
const sequelize = require("../../config/connection");

// use /api/adminaudits
// Middleware to log HTTP headers and request data
//STIG: v-222447
router.use(async (req, res, next) => {
    const { headers, method, url, body } = req;
    const userid = req.session.userid;
    const userAgent = headers['user-agent'];
    const referer = headers['referer'] || headers['referrer']; // 'referrer' is sometimes used
    const xForwardedFor = headers['x-forwarded-for']; // Client's IP address
    const date = headers['date']; // Date of the request
    const expires = headers['expires']; // Expires header
    // Prepare the data to log
    const logData = {
        method,
        url,
        user_agent: userAgent,
        referer,
        post_data: method === 'POST' ? JSON.stringify(body) : null, // Log POST data as a JSON string
        x_forwarded_for: xForwardedFor,
        date,   
        expires,
        userId: userid,
    };

    try {
        // Create a log entry using Sequelize model
        await adminAudit.create(logData);
        console.log('Log entry added to the database.');
    } catch (err) {
        console.error('Error saving log to database:', err);
    }

    next(); // Proceed to the next middleware or route handler
});

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

//update/change an adminAudit info
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

//delete an adminAudit
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
