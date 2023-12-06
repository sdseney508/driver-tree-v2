import axios from "axios";
import apiURL from "./apiURL";

const createStakeholderOutcome = (body) => {
  return axios.post(apiURL + "/stakeholder_outcomes", body);
};

const getAllStakeholderOutcomes = () => {
  return axios.get(apiURL + "/stakeholder_outcomes");
};

const getStakeholderOutcome = (id) => {
  return axios.get(apiURL + "/stakeholder_outcomes/byOutcome" + id);
};

const updateStakeholderOutcome = (id, body) => {
  return axios.put(apiURL + "/stakeholder_outcomes/" + id, body);
}

const deleteStakeholderOutcome = (id, body) => {
  return axios.delete(apiURL + "/stakeholder_outcomes/" + id, body);
}


export {
  createStakeholderOutcome,
  getAllStakeholderOutcomes,
  getStakeholderOutcome,
  updateStakeholderOutcome,
  deleteStakeholderOutcome
};
