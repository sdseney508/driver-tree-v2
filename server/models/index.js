const accountStatus = require('./accountStatus');
const arrows = require('./arrows')
const attachments = require('./attachments');
const audit = require('./audit');
const carousel = require('./carousel');
const deliverables = require('./deliverables');
const drivers = require('./drivers');
const outcomes = require('./outcomes');
const role = require('./role');
const stakeholder = require('./stakeholder');
const stakeholder_outcomes = require('./stakeholder_outcomes');
const state = require('./state');
const status = require('./status');
const User = require('./User');


//TODO:  set up table connections
outcomes.hasMany(drivers, {
    foreignKey: 'outcomeID',
});

drivers.belongsTo(outcomes, {
});

outcomes.hasMany(arrows, {
    foreignKey: 'outcomeID',
});

arrows.belongsTo(outcomes, {
});

stakeholder.hasMany(drivers, {
    foreignKey: 'stakeholdersID',
});

drivers.hasOne(stakeholder, {
});

stakeholder.hasMany(User, {
    foreignKey: 'userGroup',
});

User.belongsTo(stakeholder, {
});

stakeholder.hasMany(outcomes, {
    foreignKey: 'command',
});

outcomes.belongsTo(stakeholder, {
});


module.exports = { accountStatus, arrows, attachments, audit, carousel, deliverables, drivers, outcomes, role, stakeholder, stakeholder_outcomes, state, status, User };
