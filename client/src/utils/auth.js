import axios from "axios";
import decode from "jwt-decode";
import apiURL from "./apiURL";

const authHeader = () => {
  let id_token = localStorage.getItem("id_token");

  if (id_token) {
    // for Node.js Express back-end
    return { authorization: `Bearer ${id_token}` };
  } else {
    return {};
  }
};

const getRoles = () => {
  // debugger;
  return axios.get(apiURL + "/roles");
};

// get user data
const getProfile = () => {
  return decode(getToken());
};

const getToken = () => {
  // Retrieves the user token from localStorage
  return localStorage.getItem("id_token");
};

const getUser = (token) => {
  return axios.get(apiURL + "/users/me", { headers: authHeader() });
};

// check if user's logged in
const loggedIn = () => {
  // Checks if there is a saved token and it's still valid
  const token = getToken();
  return !!token && !isTokenExpired(token); // handwaiving here, i believe this returns a boolean value
};

// check if token is expired
const isTokenExpired = (token) => {
  try {
    const decoded = decode(token);
    if (decoded.exp < Date.now() / 1000) {
      return true;
    } else return false;
  } catch (err) {
    return false;
  }
};
const login = (idToken) => {
  // saves the session token to local storage;
  localStorage.setItem("id_token", idToken);
};

const loginUser = ({ email, password }) => {
  // Send a POST request to the API endpoint
  return axios.post(apiURL + "/users/login", {
    email,
    password,
  });
};

const logout = () => {
  // Clear user token and profile data from localStorage
  localStorage.removeItem("id_token");
  // this will reload the page and reset the state of the application
  window.location.assign("/");
};

const register = (
  firstName,
  lastName,
  email,
  password,
  userStatus,
  userRole,
  userCommand
) => {
  console.log(userCommand);
  return axios.post(apiURL + "/users", {
    firstName,
    lastName,
    email,
    password,
    userStatus,
    userRole,
    userCommand
  });
};

const updateUser = (body, id) => {
  return axios.put(apiURL + "/users/" + id, {body});
};

export {
  getRoles,
  getProfile,
  getToken,
  getUser,
  isTokenExpired,
  loggedIn,
  login,
  loginUser,
  logout,
  register,
  updateUser,
};
