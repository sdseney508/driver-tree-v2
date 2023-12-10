const router = require('express').Router();

const accountStatusRoutes = require('./accountStatusRoutes');
const arrowRoutes = require('./arrowRoutes');
const auditRoutes = require('./auditRoutes');
const carouselRoutes = require('./carouselRoutes');
const clusterRoutes = require('./clusterRoutes');
const driverRoutes = require('./driverRoutes');
const outcomeRoutes = require('./outcomeRoutes');
const roleRoutes = require('./roleRoutes');
const statusRoutes = require('./statusRoutes');
const stakeholderRoutes = require('./stakeholderRoutes');
const userRoutes = require('./userRoutes');
const viewArrowRoutes = require('./viewArrowRoutes');
const viewCardRoutes = require('./viewCardRoutes');
const viewRoutes = require('./viewRoutes');

router.use('/accountStatus', accountStatusRoutes);
router.use('/arrows', arrowRoutes);
router.use('/audit', auditRoutes);
router.use('/carousel', carouselRoutes);
router.use('/cluster', clusterRoutes);
router.use('/drivers', driverRoutes);
router.use('/outcomes', outcomeRoutes);
router.use('/roles', roleRoutes);
router.use('/status', statusRoutes);
router.use('/stakeholders', stakeholderRoutes);
router.use('/users', userRoutes);
router.use('/viewArrows', viewArrowRoutes);
router.use('/viewCards', viewCardRoutes);
router.use('/views', viewRoutes);


module.exports = router;
