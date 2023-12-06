import axios from "axios";
import apiURL from "./apiURL";

//these are the calls to create, delete, and update the individual views, also guys the database calls for all of the cards that will be full view vice transparent

//api/viewArrows/ for all of these routes.  

//gets all the cards in a view to set the opacity.  the id is the viewId
const getViewArrows = (viewId) => {
  return axios.get(apiURL + "/viewArrows/viewArrows/"+ viewId);
};

//placeholder to find a specific viewCard combo
const getViewArrow = (id) => {
  return axios.get(apiURL + "/viewArrows/" + id);
};

//add an to a view, the body is the viewId and arrowId.  This is done automatically when a driver is added to a view by checking any arrows that are associated with that driver
const addViewArrow = (body) => {
  return axios.post(apiURL + "/viewArrows/new", body);
};

//removes an arrow from a view; the body is the viewId and the ArrowId, this is done automatically when a driver is removed from a view by checking any arrows that are associated with that driver
const removeViewArrow = (body) => {
  console.log(body);
  return axios.delete(apiURL + "/viewArrows/delete", body);
}

export {
    getViewArrows,
    getViewArrow,
    addViewArrow,
    removeViewArrow
};