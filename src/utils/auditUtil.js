import axios from "axios";
import apiURL from "./apiURL";

const exportLog = () => {
  return axios.get(apiURL + "/auditlogs/");
};




export {
    exportLog
};
