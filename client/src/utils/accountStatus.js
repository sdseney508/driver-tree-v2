import axios from "axios";
import apiURL from "./apiURL";

//used by the admin if they want to create a different status for a user
const createAccountStatus = () => {
  return axios.post(apiURL + "/accountStatus/new/");
};

//used by the admin to get all the accountStatus's
const getAllAccountStatus = () => {
  return axios.get(apiURL + "/accountStatus/");
};

//used by the admin to get a specific accountStatus
const getOneAccountStatus = (id) => {
  return axios.get(apiURL + "/accountStatus/" + id);
};

//this is used by the admin to mod a status. 
const modifyAccountStatus = (statusId, body) => {
  return axios.put(apiURL + "/accountStatus/" + statusId, body);
};

//used by the admin to delete a status
const deleteAccountStatus = (id) => {
  return axios.delete(apiURL + "/accountStatus/" + id);
};

export {
  createAccountStatus,
  getAllAccountStatus,
  getOneAccountStatus,
  modifyAccountStatus,
  deleteAccountStatus
};
