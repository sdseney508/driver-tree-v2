import axios from "axios";
import { jwtDecode } from "jwt-decode";
import apiURL from "./apiURL";
// import {  setState } from "react";

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
  return axios.get(apiURL + "/roles");
};

// get user data
const getProfile = () => {
  return jwtDecode(getToken());
};

const getToken = () => {
  // Retrieves the user token from localStorage
  return localStorage.getItem("id_token");
};

const getUser = (token) => {
  return axios.get(apiURL + "/users/me", { headers: authHeader() });
};

const getAppData = async ({
  navigate,
  outcomeId,
  state,
  setState,
  outcomeByCommand,
  setSelOutcome,
  getOutcome
}) => {
  //this first part just ensures they whoever is on this page is an authenticated user; prevents someone from typing in the url and gaining access
  try {
    //these comes from the utils section of the code
    const token = loggedIn() ? getToken() : null;
    if (!token) {
      navigate("/");
    }
    const response = await getUser(token);
    if (!response.data) {
      navigate("/");
      throw new Error("something went wrong!");
    }
    const user = response.data;

    let userDataLength = Object.keys(user).length;
    //used to make sure they have permissions to make changes
    //if the user isnt logged in with an unexpired token, send them to the login page
    if (!userDataLength > 0) {
      navigate("/");
    } else {
      setState({
        ...state,
        firstName: user.firstName,
        lastName: user.lastName,
        Role: user.userRole,
        command: user.stakeholderId,
        userId: user.id,
      });
      //checks to see if there was an outcomeId passed or if you entered from the user page
      if (!outcomeId) {
        await outcomeByCommand(user.stakeholderId).then((data) => {
          setSelOutcome(data.data[0]);
        });
      } else {
        await getOutcome(outcomeId).then((data) => {
          setSelOutcome(data.data);
        });
      }
    }
  } catch (err) {
    console.error(err);
    navigate("/");
  }
};

const getUserData = async (navigate, state, setState) => {
  try {
    const token = loggedIn() ? getToken() : null;
    if (!token) {
      navigate("/");
    }
    const response = await getUser(token);
    if (!response.data) {
      navigate("/");
      throw new Error("something went wrong!");
    }
    const user = response.data;
    setState({
      ...state,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userId: user.id,
      userRole: user.userRole,
      command: user.stakeholderId,
    });
    let userDataLength = Object.keys(user).length;
    //if the user isnt logged in with an unexpired token, send them to the login page
    if (!userDataLength > 0) {
      navigate("/");
    }
  } catch (err) {
    console.error(err);
  }
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
    const decoded = jwtDecode(token);
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
  return axios.post(apiURL + "/users", {
    firstName,
    lastName,
    email,
    password,
    userStatus,
    userRole,
    userCommand,
  });
};

const updateUser = (body, id) => {
  return axios.put(apiURL + "/users/" + id, body);
};

export {
  getAppData,
  getRoles,
  getProfile,
  getToken,
  getUser,
  getUserData,
  isTokenExpired,
  loggedIn,
  login,
  loginUser,
  logout,
  register,
  updateUser,
};
