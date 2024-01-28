const accountStatus = require("./accountStatus");
const adminAudit = require("./adminAudit");
const arrows = require("./arrows");
const attachments = require("./attachments");
const audit = require("./audit");
const carousel = require("./carousel");
const clusters = require("./clusters");
const deliverables = require("./deliverables");
const drivers = require("./drivers");
const outcomes = require("./outcomes");
const role = require("./role");
const stakeholders = require("./stakeholders");
const state = require("./state");
const status = require("./status");
const statusDefinition = require("./statusDefinition");
const User = require("./User");
const viewArrows = require("./viewArrows");
const viewCards = require("./viewCards");
const views = require("./views");


outcomes.hasMany(drivers, {
  onDelete: "CASCADE",
});

drivers.belongsTo(outcomes, {});

outcomes.hasMany(arrows, {
  onDelete: "CASCADE",
});

arrows.belongsTo(outcomes, {});

stakeholders.hasMany(outcomes, {
  // foreignKey: 'stakeholderID',
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
  clusters,
  deliverables,
  drivers,
  outcomes,
  role,
  stakeholders,
  state,
  status,
  statusDefinition,
  User,
  viewArrows,
  viewCards,
  views,
};
