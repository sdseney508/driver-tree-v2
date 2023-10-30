const router = require('express').Router();

const accountStatusRoutes = require('./accountStatusRoutes');
const arrowRoutes = require('./arrowRoutes');
const auditRoutes = require('./auditRoutes');
const carouselRoutes = require('./carouselRoutes');
const outcomeRoutes = require('./outcomeRoutes');
const driverRoutes = require('./driverRoutes');
const roleRoutes = require('./roleRoutes');
const stakeholderRoutes = require('./stakeholderRoutes');
const userRoutes = require('./userRoutes');

router.use('/accountStatus', accountStatusRoutes);
router.use('/arrows', arrowRoutes);
router.use('/audit', auditRoutes);
router.use('/carousel', carouselRoutes);
router.use('/drivers', driverRoutes);
router.use('/outcomes', outcomeRoutes);
router.use('/roles', roleRoutes);
router.use('/stakeholders', stakeholderRoutes);
router.use('/users', userRoutes);


module.exports = router;
