const router = require('express').Router();

const accountStatusRoutes = require('./accountStatusRoutes');
const adminAuditRoutes = require('./adminAuditRoutes');
const arrowRoutes = require('./arrowRoutes');
const auditRoutes = require('./auditRoutes');
const carouselRoutes = require('./carouselRoutes');
const classificationRoutes = require('./classificationRoutes')
const clusterRoutes = require('./clusterRoutes');
const driverRoutes = require('./driverRoutes');
const outcomeRoutes = require('./outcomeRoutes');
const outcomeDriversRoutes = require('./outcomeDriversRoutes');
const roleRoutes = require('./roleRoutes');
const sessionRoutes = require('./sessionRoutes');
const statusRoutes = require('./statusRoutes');
const statusDefinitionRoutes = require('./statusDefinitionRoutes')
const stakeholderRoutes = require('./stakeholderRoutes');
const userRoutes = require('./userRoutes');
const viewArrowRoutes = require('./viewArrowRoutes');
const viewCardRoutes = require('./viewCardRoutes');
const viewRoutes = require('./viewRoutes');

router.use('/accountStatus', accountStatusRoutes);
router.use('/adminAudit', adminAuditRoutes);
router.use('/arrows', arrowRoutes);
router.use('/audit', auditRoutes);
router.use('/carousel', carouselRoutes);
router.use('/classification', classificationRoutes);
router.use('/cluster', clusterRoutes);
router.use('/drivers', driverRoutes);
router.use('/outcomes', outcomeRoutes);
router.use('/outcomeDrivers', outcomeDriversRoutes);
router.use('/roles', roleRoutes);
router.use('/session', sessionRoutes);
router.use('/status', statusRoutes);
router.use('/statusDefinition', statusDefinitionRoutes);
router.use('/stakeholders', stakeholderRoutes);
router.use('/users', userRoutes);
router.use('/viewArrows', viewArrowRoutes);
router.use('/viewCards', viewCardRoutes);
router.use('/views', viewRoutes);


module.exports = router;
