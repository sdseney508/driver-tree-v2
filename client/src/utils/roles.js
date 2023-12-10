import axios from "axios";
import apiURL from "./apiURL";

//used by the admin if they want to create a different role for a user
const createRole = () => {
  return axios.post(apiURL + "/roles/new/");
};

//used by the admin to get all the role's
const getAllRoles = () => {
  return axios.get(apiURL + "/roles/");
};

//used by the admin to get a specific role
const getOneRole = (roleId) => {
  return axios.get(apiURL + "/roles/" + roleId);
};

//this is used by the admin to mod a role. 
const modifyRole = (roleId, body) => {
  return axios.put(apiURL + "/roles/" +roleId, body);
};

//used by the admin to delete a role
const deleteRole = (roleId) => {
  return axios.delete(apiURL + "/roles/" + roleId);
};

export {
  createRole,
  getAllRoles,
  getOneRole,
  modifyRole,
  deleteRole
};