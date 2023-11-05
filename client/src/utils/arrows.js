import axios from "axios";
import apiURL from "./apiURL";

const createArrow = (body) => {
  console.log(body);
  return axios.post(apiURL + "/arrows/new/", body);
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
  getArrows,
  updateArrow,
  deleteArrow
};
