import axios from "axios";
import apiURL from "./apiURL";

//these are the calls to create, delete, and update the individual views, also has the database calls for all of the cards that will be full view vice transparent

//gets all the cards in a view to set the opacity.  the id is the viewId
const getViewCards = (viewId) => {
  return axios.get(apiURL + "/viewCards/viewCards/"+ viewId);
};

//placeholder to find a specific viewCard combo
const getViewCard = (id) => {
  return axios.delete(apiURL + "/viewCards/" + id);
};

//add a driver to a view, the body is the viewId and driverId
const addViewCard = (body) => {
  return axios.post(apiURL + "/viewCards/new", body);
};

//removes a driver from a view; the body is the viewId and the driverId
const removeViewCard = (body) => {
  console.log(body);
  return axios.delete(apiURL + "/viewCards/delete/"+ body.viewId + "/" + body.driverId);
}

export {
    getViewCards,
    getViewCard,
    addViewCard,
    removeViewCard
};