import axios from "axios";
import apiURL from "./apiURL";

const getAccountStatus = () => {
    return axios.get(apiURL + "/accountStatus");
  };

const getRoles = () => {
    return axios.get(apiURL + "/roles");
  };


export { getAccountStatus, getRoles };
