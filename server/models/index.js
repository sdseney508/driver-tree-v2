const accountStatus = require("./accountStatus");
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
const User = require("./User");
const viewArrows = require("./viewArrows");
const viewCards = require("./viewCards");
const views = require("./views");

//TODO:  set up table connections
outcomes.hasMany(drivers, {
  // foreignKey: 'outcomeID',
  onDelete: "CASCADE",
});

drivers.belongsTo(outcomes, {});

outcomes.hasMany(arrows, {
  // foreignKey: 'outcomeID',
  onDelete: "CASCADE",
});

arrows.belongsTo(outcomes, {});

stakeholders.hasMany(outcomes, {
  // foreignKey: 'stakeholderID',
});

outcomes.belongsTo(stakeholders, {});

clusters.belongsTo(outcomes, {});

outcomes.hasMany(clusters, {
  // foreignKey: 'outcomeID',
  onDelete: "CASCADE",
});

clusters.hasMany(drivers, {
  // foreignKey: 'clusterID',
  //no need for cascade delete, the delete route in clusterRoutes updates the correct drivers.
});

drivers.belongsTo(clusters, {});

stakeholders.hasMany(drivers, {});

drivers.hasOne(stakeholders, {});

stakeholders.hasMany(User, {
  // foreignKey: 'userCommand',
});

User.belongsTo(stakeholders, {});

views.belongsTo(outcomes, {});

outcomes.hasMany(views, {
  // foreignKey: 'outcomeID',
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

module.exports = {
  accountStatus,
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
  User,
  viewArrows,
  viewCards,
  views,
};
