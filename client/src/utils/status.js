import axios from "axios";
import apiURL from "./apiURL";

//used by the admin if they want to create a different role for a user
const createStatus = () => {
  return axios.post(apiURL + "/status/new/");
};

//used by the admin to get all the role's
const getAllStatuses = () => {
  return axios.get(apiURL + "/status/");
};

//used by the admin to get a specific role
const getOneStatus = (statusId) => {
  return axios.get(apiURL + "/status/" + statusId);
};

//this is used by the admin to mod a status. 
const modifyStatus = (statusId, body) => {
  return axios.put(apiURL + "/status/" +statusId, body);
};

//used by the admin to delete a status
const deleteStatus = (statusId) => {
  return axios.delete(apiURL + "/status/" + statusId);
};

export {
  createStatus,
  getAllStatuses,
  getOneStatus,
  modifyStatus,
  deleteStatus
};