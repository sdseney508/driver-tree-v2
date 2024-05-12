import axios from "axios";
import apiURL from "./apiURL";

//used by the admin if they want to create a different role for a user
const createClassificationDefinition = () => {
  return axios.post(apiURL + "/classification/new/");
};

//used by the admin to get all the role's
const getAllClassificationDefinitions = () => {
  return axios.get(apiURL + "/classification/");
};

//used by the admin to get a specific role
const getOneClassificationDefinition = (ClassificationDefId) => {
  return axios.get(apiURL + "/classification/" + ClassificationDefId);
};

//this is used by the admin to mod a Classification. 
const modifyClassificationDefinition = (ClassificationDefId, body) => {
  return axios.put(apiURL + "/classification/" + ClassificationDefId, body);
};

//used by the admin to delete a Classification
const deleteClassificationDefinition = (ClassificationDefId) => {
  return axios.delete(apiURL + "/classification/" + ClassificationDefId);
};

export {
  createClassificationDefinition,
  getAllClassificationDefinitions,
  getOneClassificationDefinition,
  modifyClassificationDefinition,
  deleteClassificationDefinition
};