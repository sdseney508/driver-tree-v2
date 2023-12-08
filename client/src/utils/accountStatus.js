import axios from "axios";
import apiURL from "./apiURL";

//used by the admin if they want to create a different status for a user
const createStatus = () => {
  return axios.post(apiURL + "/accountStatus/new/");
};

//used by the admin to get all the accountStatus's
const getAllStatus = () => {
  return axios.get(apiURL + "/accountStatus/");
};

//used by the admin to get a specific accountStatus
const getOneStatus = (id) => {
  return axios.get(apiURL + "/accountStatus/" + id);
};

//this is used by the admin to mod a status. 
const modifyStatus = (statusId, body) => {
  return axios.put(apiURL + "/status/" + statusId, body);
};

//used by the admin to delete a status
const deleteStatus = (id) => {
  return axios.delete(apiURL + "/status/" + id);
};

export {
  createStatus,
  getAllStatus,
  getOneStatus,
  modifyStatus,
  deleteStatus
};
