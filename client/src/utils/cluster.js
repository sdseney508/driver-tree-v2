import axios from "axios";
import apiURL from "./apiURL";

//these are the calls to create, delete, and update clusters

const bulkClusterCreate = (body) => {
  return axios.put(apiURL + "/cluster/bulkCreate", body);
};

const createCluster = (body) => {
  return axios.post(apiURL + "/cluster/new", body);
};

const deleteCluster = (id) => {
  return axios.delete(apiURL + "/cluster/" + id);
};

const getCluster = (id) => {
  return axios.get(apiURL + "/cluster/" + id);
};

const updateCluster = (id, body) => {
  return axios.put(apiURL + "/cluster/update/" + id, body);
};


export {
  bulkClusterCreate,
  createCluster,
  deleteCluster,
  getCluster,
  updateCluster,
};
