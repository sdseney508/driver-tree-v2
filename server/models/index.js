const accountStatus = require('./accountStatus');
const arrows = require('./arrows')
const attachments = require('./attachments');
const audit = require('./audit');
const carousel = require('./carousel');
const deliverables = require('./deliverables');
const drivers = require('./drivers');
const outcomes = require('./outcomes');
const role = require('./role');
const stakeholders = require('./stakeholders');
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

drivers.hasMany(arrows, {
    foreignKey: 'driverID',
    onDelete: 'CASCADE',
});

arrows.belongsTo(drivers, {
});

stakeholders.hasMany(drivers, {
    foreignKey: 'stakeholdersID',
});

drivers.hasOne(stakeholders, {
});

stakeholders.hasMany(User, {
    foreignKey: 'userGroup',
});

User.belongsTo(stakeholders, {
});

stakeholders.hasMany(outcomes, {
    foreignKey: 'command',
});

outcomes.belongsTo(stakeholders, {
});


module.exports = { accountStatus, arrows, attachments, audit, carousel, deliverables, drivers, outcomes, role, stakeholders, state, status, User };
