import axios from "axios";
import apiURL from "./apiURL";

//these are the calls to create, delete, and update the individual views, also has the database calls for all of the cards that will be full view vice transparent

const createView = (body) => {
  return axios.post(apiURL + "/views/new/", body);
};

const deleteView = (viewId) => {
  return axios.delete(apiURL + "/views/" + viewId);
};

const getView = (viewId) => {
  return axios.get(apiURL + "/views/" + viewId);
};

const getUserViewsForOutcome = (body) => {
  return axios.get(apiURL + "/views/userByOutcome/" + body.userId + "/" + body.outcomeId);
}

const updateView = (body, id) => {
  return axios.put(apiURL + "/views/update/" + id, body);
};


export {
  createView,
  deleteView,
  getUserViewsForOutcome,
  getView,
  updateView,
};
