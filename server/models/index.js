const accountStatus = require("./accountStatus");
const adminAudit = require("./adminAudit");
const arrows = require("./arrows");
const attachments = require("./attachments");
const audit = require("./audit");
const carousel = require("./carousel");
const caveates = require("./caveates");
const classification = require('./classification');
const clusters = require("./clusters");
const drivers = require("./drivers");
const outcomes = require("./outcomes");
const outcomeDrivers = require("./outcomeDrivers");
const role = require("./role");
const session = require("./session");
const stakeholders = require("./stakeholders");
const state = require("./state");
const status = require("./status");
const statusDefinition = require("./statusDefinition");
const User = require("./User");
const viewArrows = require("./viewArrows");
const viewCards = require("./viewCards");
const views = require("./views");


outcomes.belongsToMany(drivers, {
  through: "outcomeDrivers",
});

drivers.belongsToMany(outcomes, {
  through: "outcomeDrivers",
});

outcomes.hasMany(arrows, {
  onDelete: "CASCADE",
});

arrows.belongsTo(outcomes, {});

stakeholders.hasMany(outcomes, {
});

outcomes.belongsTo(stakeholders, {});

clusters.belongsTo(outcomes, {});

outcomes.hasMany(clusters, {
  onDelete: "CASCADE",
});

clusters.hasMany(drivers, {
  //no need for cascade delete, the delete route in clusterRoutes updates the correct drivers.  And you dont want to delete the clusters and drivers in this manner because you will lose the history of the drivers.
});

drivers.belongsTo(clusters, {});

stakeholders.hasMany(drivers, {});

drivers.hasOne(stakeholders, {});

stakeholders.hasMany(User, {
});

User.belongsTo(stakeholders, {});

views.belongsTo(outcomes, {});

outcomes.hasMany(views, {
  onDelete: "CASCADE",
});

views.belongsToMany(drivers, {
  through: "viewCards",
});

drivers.belongsToMany(views, {
  through: "viewCards",
});

views.belongsToMany(arrows, {
  through: "viewArrows",
});

arrows.belongsToMany(views, {
  through: "viewArrows",
});

views.belongsTo(User, {});

User.hasMany(views, {
  // foreignKey: 'userID',
  onDelete: "CASCADE",
});

status.belongsToMany(outcomes, {
  through: "statusDefinition",
});

outcomes.belongsToMany(status, {
  through: "statusDefinition",
});

module.exports = {
  accountStatus,
  adminAudit,
  arrows,
  attachments,
  audit,
  carousel,
  classification,
  clusters,
  drivers,
  outcomes,
  outcomeDrivers,
  role,
  session,
  stakeholders,
  state,
  status,
  statusDefinition,
  User,
  viewArrows,
  viewCards,
  views,
};
