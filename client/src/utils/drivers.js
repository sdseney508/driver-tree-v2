import axios from "axios";
import apiURL from "./apiURL";

const allDrivers = () => {
  return axios.get(apiURL + "/drivers");
};

//this is for admin use only
const allOutcomes = () => {
  return axios.get(apiURL + "/outcomes");
};

//used when creating a new version of an Outcome Tree
const bulkDriverCreate = (body) => {
  return axios.post(apiURL + "/drivers/bulkCreate", body);
};

//used for the cascading status update
const bulkDriverStatusUpdate = (body) => {
  return axios.put(apiURL + "/drivers/bulkUpdate", body);
};

const outcomeByCommand = (command) => {
  return axios.get(apiURL + "/outcomes/command/" + command);
};

const createDriver = (body, userId) => {
  return axios.post(apiURL + "/drivers/new/"+userId, body);
};

const createOutcome = (body) => {
  return axios.post(apiURL + "/outcomes/new", body);
};

const deleteDriver = (id) => {
  return axios.delete(apiURL + "/drivers/" + id);
};

const getCluster = (id, body) => {
  return axios.get(apiURL + "/drivers/byOutcomeByTier/" + id, body);
}

const getDriverById = (id) => { 
  return axios.get(apiURL + "/drivers/getOne/" + id);
};

const getDrivers = () => {
  return axios.get(apiURL + "/drivers/");
};

const getDriverByOutcome = (id) => {  
  //the id is the outcome id, not the driver id, this does not return a driver, it returns the drivers for an outcome joined with the cluster information
  return axios.get(apiURL + "/drivers/byoutcome/" + id);
};

const getOutcome = (id) => {
  return axios.get(apiURL + "/outcomes/getOne/" + id);
};

const appendAdminLog = (id, log) => {
  console.log(log);
  return axios.put(apiURL + "/oplimits/adminlog/" + id,  log );
};


const findUser = (id) => {
  return axios.get(apiURL + "/users/userbyID/" + id);
};


//get the coordinators list to use in the Forgot Email Contact Page
const getCoords = () => {
  return axios.get(apiURL + "/users/coordinators/");
};

const getDraft = () => {
  return axios.get(apiURL + "/drivers/draft");
};

//this is used in the cascadeUpdate function in utils
const getDriversByCluster = (clusterId) => {
  return axios.get(apiURL + "/drivers/byCluster/" + clusterId);
};

const getEmails = () => {
  return axios.get(apiURL + "/users/emails");
};

const getStakeholders = (id) => {
  return axios.get(apiURL + "/stakeholders/"+id);
}

const getUsers = () => {
  return axios.get(apiURL + "/users");
};

const updateCluster = (id, body) => {
  return axios.put(apiURL + "/drivers/clusterUpdate/" + id, body);
};

const updateDriver = (id, userId, body) => {
  return axios.put(apiURL + "/drivers/update/" + id + "/" + userId, body);
};

const updateOutcome = (id, body) => {
  return axios.put(apiURL + "/outcomes/update/" + id, body);
};

const updateOutcomeDriver = (outcomeId, driverId, userId, body) => {
  return axios.put(apiURL + "/outcomeDrivers/update/" + outcomeId + "/" + driverId+"/" + userId, body);
}

export {
  allDrivers,
  allOutcomes,
  appendAdminLog,
  bulkDriverCreate,
  bulkDriverStatusUpdate,
  createDriver,
  createOutcome,
  deleteDriver,
  findUser,
  getCluster,
  getCoords,
  getDraft,
  getDriverById,
  getDrivers,
  getDriversByCluster,
  getDriverByOutcome,
  getEmails,
  getOutcome,
  getStakeholders,
  getUsers,
  outcomeByCommand,
  updateCluster,
  updateDriver,
  updateOutcome,
  updateOutcomeDriver,
};
