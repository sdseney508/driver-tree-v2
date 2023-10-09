import axios from "axios";
import apiURL from "./apiURL";

const getAccountStatus = () => {
    // debugger;
    return axios.get(apiURL + "/accountStatus");
  };

const getFunctional = () => {
  return axios.get(apiURL + "/functionalArea");
};

const getRoles = () => {
    // debugger;
    return axios.get(apiURL + "/roles");
  };


export { getAccountStatus, getFunctional, getRoles };
