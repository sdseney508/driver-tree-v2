const sequelize = require("../config/connection");

const {
  accountStatus,
  drivers,
  outcomes,
  role, 
  stakeholder,
  state,
  status,
  User, 
} = require("../models");

const accountStatusData = require("./accountStatusData.json");
const driversData = require("./driversData.json");
const outcomesData = require("./outcomesData.json");
const roleData = require("./roleData.json");
const stakeholderData = require("./stakeholderData.json");
const stateData = require("./stateData.json");
const statusData = require('./statusData.json');
const userData = require("./userData.json");


const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  //needs to be done first due to foreign key constraints
  const outcome = await outcomes.bulkCreate(outcomesData, {
    individualHooks: true,
    returning: true,
  });
  const account = await accountStatus.bulkCreate(accountStatusData, { 
    individualHooks: true,
    returning: true,
  });

  const driver = await drivers.bulkCreate(driversData, {
    individualHooks: true,
    returning: true,
  });

  
  const rol = await role.bulkCreate(roleData, {
    individualHooks: true,
    returning: true,
  });

  const stakehold = await stakeholder.bulkCreate(stakeholderData, {
    individualHooks: true,
    returning: true,
  });
  
  const stat = await state.bulkCreate(stateData, {
    individualHooks: true,
    returning: true,
  });

  const statuses = await status.bulkCreate(statusData, {
    individualHooks: true,
    returning: true,
  });

  //do this one last since it is dependent upon the other tables
  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });


  process.exit(0);
};

seedDatabase();
