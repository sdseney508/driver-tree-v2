import axios from "axios";
import apiURL from "./apiURL";

//used by the admin if they want to create a different role for a user
const createStatusDefinition = () => {
  return axios.post(apiURL + "/statusDefinition/new/");
};

//used by the admin to get all the role's
const getAllStatusDefinitions = () => {
  return axios.get(apiURL + "/statusDefinition/");
};

const getStatusDefinitionByOutcome = (outcomeId) => {
  return axios.get(apiURL + "/statusDefinition/byOutcome/" + outcomeId);
};

//used by the admin to get a specific role
const getOneStatusDefinition = (statusDefId) => {
  return axios.get(apiURL + "/statusDefinition/" + statusDefId);
};

//this is used by the admin to mod a status. 
const modifyStatusDefinition = (statusDefId, body) => {
  return axios.put(apiURL + "/statusDefinition/" + statusDefId, body);
};

//used by the admin to delete a status
const deleteStatusDefinition = (statusDefId) => {
  return axios.delete(apiURL + "/statusDefinition/" + statusDefId);
};

export {
  createStatusDefinition,
  getAllStatusDefinitions,
  getOneStatusDefinition,
  getStatusDefinitionByOutcome,
  modifyStatusDefinition,
  deleteStatusDefinition
};