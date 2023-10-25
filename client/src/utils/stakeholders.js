import axios from "axios";
import apiURL from "./apiURL";

const allStakeholders = () => {
  return axios.get(apiURL + "/stakesholders");
};

const createStakeholder = (body) => {
  return axios.post(apiURL + "/stakeholders/", body);
};

const deleteStakeholder = (id) => {
  return axios.delete(apiURL + "/stakeholder/" + id);
};

const updateStakeholder = (id, body) => {
  return axios.put(apiURL + "/stakeholders/" + id, body);
};

export {
  allStakeholders,
  createStakeholder,
  deleteStakeholder,
  updateStakeholder
};
