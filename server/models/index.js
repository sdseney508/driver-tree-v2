const accountStatus = require('./accountStatus');
const arrows = require('./arrows');
const attachments = require('./attachments');
const audit = require('./audit');
const carousel = require('./carousel');
const deliverables = require('./deliverables');
const drivers = require('./drivers');
const outcomes = require('./outcomes');
const role = require('./role');
const stakeholder = require('./stakeholder');
const state = require('./state');
const status = require('./status');
const User = require('./User');


//TODO:  set up table connections
outcomes.hasMany(drivers, {
    foreignKey: 'outcomeID',
});

drivers.belongsTo(outcomes, {
    
});

module.exports = { accountStatus, arrows, attachments, audit, carousel, deliverables, drivers, outcomes, role, stakeholder, state, status, User };
