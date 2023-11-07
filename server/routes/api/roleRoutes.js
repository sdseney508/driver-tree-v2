const router = require('express').Router();
const { role } = require('../../models');

// use /api/roles
//create a role
router.post('/', async (req, res) => {
  try {
    const roleData = await role.create(req.body);
    res.status(200).json(roleData);
  } catch (err) {
    console.log(err);
    res.status(400).json(err);
  }
});

//get all roles to fill in the create account form.  this get used to build
// the dropdown list of roles
router.get('/', async (req, res) => {
    try {
        const roleData = await role.findAll({
            attributes: ['id', 'role']
        });
        res.status(200).json(roleData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//get specific role for future use
router.get('/:id', async (req, res) => {
    try {
        const roleData = await role.findByPk(req.params.id);
        res.status(200).json(roleData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
});

//update role info      
router.put('/:id', async (req, res) => {
    try { 
        const roleData = await role.update(req.body, {
            where: {
                id: req.params.id,
            },
        });
        if (!roleData) {
            res.status(404).json({ message: 'No role found with this id!' });
            return;
        }
        res.status(200).json(roleData);

    } catch (err) { 
        console.log(err);
        res.status(400).json(err);
    }

});

//delete role
router.delete('/:id', async (req, res) => {
    try {
        const roleData = await role.destroy({
            where: {
                id: req.params.id,
            },
        });
        res.status(200);
    } catch (err) {
        console.log(err);
        res.status(400).json(err);
    }
});

module.exports = router;