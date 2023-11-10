import axios from "axios";
import apiURL from "./apiURL";

const allDrivers = () => {
  return axios.get(apiURL + "/drivers");
};

//this is for admin use only
const allOutcomes = () => {
  return axios.get(apiURL + "/outcomes");
};

const outcomeByCommand = (command) => {
  return axios.get(apiURL + "/outcomes/command/" + command);
};

const createDriver = (body) => {
  return axios.post(apiURL + "/drivers/new", body);
};

const createOutcome = (body) => {
  return axios.post(apiURL + "/outcomes/new", body);
};

const deleteDriver = (id) => {
  console.log(id);
  console.log(apiURL + "/drivers/delete/" + id);
  return axios.delete(apiURL + "/drivers/" + id);
};

const getCluster = (id, body) => {
  return axios.get(apiURL + "/drivers/byOutcomeByTier/" + id, body);
}

const getDriver = (id) => { 
  return axios.get(apiURL + "/drivers/getOne/" + id);
};

const getDrivers = () => {
  return axios.get(apiURL + "/drivers/");
};

const getDriverByOutcome = (id) => {  
  //the id is the outcome id, not the driver id
  return axios.get(apiURL + "/drivers/byoutcome/" + id);
};

const getOutcome = (id) => {
  return axios.get(apiURL + "/outcomes/getOne/" + id);
};

const appendAdminLog = (id, log) => {
  console.log(log);
  return axios.put(apiURL + "/oplimits/adminlog/" + id, { log });
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

const updateDriver = (id, body) => {
  return axios.put(apiURL + "/drivers/update/" + id, body);
};

const updateOutcome = (id, body) => {
  return axios.put(apiURL + "/outcomes/update/" + id, body);
};

export {
  allDrivers,
  allOutcomes,
  appendAdminLog,
  createDriver,
  createOutcome,
  deleteDriver,
  findUser,
  getCluster,
  getCoords,
  getDraft,
  getDriver,
  getDrivers,
  getDriverByOutcome,
  getEmails,
  getOutcome,
  getStakeholders,
  getUsers,
  outcomeByCommand,
  updateCluster,
  updateDriver,
  updateOutcome
};
