import axios from "axios";
import apiURL from "./apiURL";

const getAccountStatus = () => {
    // debugger;
    return axios.get(apiURL + "/accountStatus");
  };

const getRoles = () => {
    // debugger;
    return axios.get(apiURL + "/roles");
  };


export { getAccountStatus, getRoles };
