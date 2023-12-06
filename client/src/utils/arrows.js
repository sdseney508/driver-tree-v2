import axios from "axios";
import apiURL from "./apiURL";

const createArrow = (body) => {
  console.log(body);
  return axios.post(apiURL + "/arrows/new/", body);
};

const getArrow = (id) => {
  return axios.get(apiURL + "/arrows/" + id);
};

//this is used with the onDrop function on the DriverPage to modify the arrow properties after you drag a card to a new tier
const findArrows = (body) => {
  console.log(body);
  return axios.get(apiURL + "/arrows/find/" + body.id + "/" + body.outcomeId);
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
  findArrows,
  getArrow,
  getArrows,
  updateArrow,
  deleteArrow
};
