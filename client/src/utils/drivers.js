import axios from "axios";
import apiURL from "./apiURL";

const allDrivers = () => {
  return axios.get(apiURL + "/drivers");
};

const allOutcomes = () => {
  return axios.get(apiURL + "/outcomes");
};

const createDriver = () => {
  return axios.post(apiURL + "/drivers/new");
};

const createOutcome = () => {
  return axios.post(apiURL + "/outcomes/new");
};

const getDriver = (id) => { 
  return axios.get(apiURL + "/drivers/getOne" + id);
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

const getUsers = () => {
  return axios.get(apiURL + "/users");
};

const updateDriver = (id, {body}) => {
  return axios.put(apiURL + "/drivers/update/" + id, { body });
};


export {
  allDrivers,
  allOutcomes,
  appendAdminLog,
  createDriver,
  createOutcome,
  findUser,
  getCoords,
  getDraft,
  getDriver,
  getDrivers,
  getDriverByOutcome,
  getEmails,
  getOutcome,
  getUsers,
  updateDriver
};
