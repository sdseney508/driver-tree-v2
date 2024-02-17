import axios from "axios";
import apiURL from "./apiURL";

//these are the calls to create, delete, and update the individual views, also has the database calls for all of the cards that will be full view vice transparent


//add a driver to a view, the body is the outcomeId and driverId
const addOutcomeDriver = (body) => {
  return axios.post(apiURL + "/outcomeDrivers/new", body);
};

//removes a driver from a view; the body is the outcomeId and the driverId
const removeOutcomeDriver = (body) => {
  console.log(body);
  return axios.delete(apiURL + "/outcomeDrivers/delete/"+ body.outcomeId + "/" + body.driverId);
}

export {
    addOutcomeDriver,
    removeOutcomeDriver,
};