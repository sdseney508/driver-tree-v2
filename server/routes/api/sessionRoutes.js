const router = require('express').Router();
const { session } = require('../../models');
const { Op } = require("sequelize");

// use /api/session
//create a session.
router.post('/', async (req, res) => {
  try {
    const sessionData = await session.create();
    res.status(200).json(sessionData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

router.put('/session/refresh', async (req, res) => {  
    try {
        const token = req.headers.authorization; // Extract the token
        const thisSession = await session.findOne({ where: { token } });
      
        if (thisSession) {
          thisSession.lastActivity = Date.NOW;
          await thisSession.save();
          return res.status(200).send('Session refreshed');
        }

    } catch (err) {
        console.log(err);
        res.status(404).send('Session not found');
    }
  });

//get all session; this is used on the admin page to allow the admin to change a session
router.get('/', async (req, res) => {
    try {
        const sessionData = await session.findAll();
        res.status(200).json(sessionData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//get specific session for future use
router.get('/:id', async (req, res) => {
    try {
        const sessionData = await session.findByPk(req.params.id);
        res.status(200).json(sessionData);
    } catch (err) {
        res.status(500).json(err);
    }
});

//update/change a session info      
router.put('/:id', async (req, res) => {
    try { 
        const sessionData = await session.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!sessionData) {
            res.status(404).json({ message: 'No session found with this id!' });
            return;
        }
        res.status(200).json(sessionData);

    } catch (err) { 
        res.status(400).json(err);
    }

});

//delete a session.  This should almost never be used
router.delete('/:id', async (req, res) => {
    try {
        const sessionData = await session.destroy({
            where: {
                id: req.params.id,
            },
        });
    } catch (err) {
        res.status(400).json(err);
    }
});

module.exports = router;