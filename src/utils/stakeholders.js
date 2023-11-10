import axios from "axios";
import apiURL from "./apiURL";

const allStakeholders = () => {
  return axios.get(apiURL + "/stakeholders/");
};

const createStakeholder = (body) => {
  return axios.post(apiURL + "/stakeholders/", body);
};

const deleteStakeholder = (id) => {
  return axios.delete(apiURL + "/stakeholders/" + id);
};

const getStakeholder = (id) => {
  return axios.get(apiURL + "/stakeholders/" + id);
};


const updateStakeholder = (id, body) => {
  return axios.put(apiURL + "/stakeholders/" + id, body);
};

export {
  allStakeholders,
  createStakeholder,
  deleteStakeholder,
  getStakeholder,
  updateStakeholder
};
