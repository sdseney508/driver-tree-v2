import axios from "axios";
import apiURL from "./apiURL";

const createArrow = (body) => {
  console.log(body);
  return axios.post(apiURL + "/arrows/new/", body);
};

const getArrow = (id) => {
  return axios.get(apiURL + "/arrows/" + id);
};

const getArrows = (id) => {
  return axios.get(apiURL + "/arrows/outcomeID/" + id);
}

const updateArrow = (id, body) => {
  return axios.put(apiURL + "/arrows/update/" + id, body);
};

const deleteArrow = (id) => {
  return axios.delete(apiURL + "/arrows/delete/" + id);
};

export {
  createArrow,
  getArrow,
  getArrows,
  updateArrow,
  deleteArrow
};
