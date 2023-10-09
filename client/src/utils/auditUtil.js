import axios from "axios";
import apiURL from "./apiURL";
//for local testing
// const apiURL = "http://localhost:8080/api";

//for deployed build
// const apiURL = "https://operations-limit-database.herokuapp.com/api";

const exportLog = () => {
  return axios.get(apiURL + "/auditlogs/");
};




export {
    exportLog
};
