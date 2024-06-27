import axios from "axios";
import { jwtDecode } from "jwt-decode";
import apiURL from "./apiURL";
import { getOutcome, outcomeByCommand } from "./drivers";

const authHeader = () => {
  let id_token = localStorage.getItem("id_token");

  if (id_token) {
    // for Node.js Express back-end
    return { authorization: `Bearer ${id_token}` };
  } else {
    return {};
  }
};

const deleteUser = (id, adminId) => {
  return axios.delete(apiURL + "/users/delete/" + id + "/" + adminId);
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

const getUser = () => {
  return axios.get(apiURL + "/users/me", { headers: authHeader() });
};

const getAppData = async ({
  navigate,
  outcomeId,
  state,
  setState,
  setSelOutcome,
  getOutcome,
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
        firstName: user.firstName,
        lastName: user.lastName,
        userRole: user.userRole,
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

const getUserData = async ({ navigate, state, setState, outcomeId}) => {
  
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

    await setState(prevState =>({
      ...prevState,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      userId: user.id,
      userRole: user.userRole,
      command: user.stakeholderId,
      lastLogin: user.lastLogin,
    }));
    let userDataLength = Object.keys(user).length;
    //if the user isnt logged in with an unexpired token, send them to the login page
    if (!userDataLength > 0) {
      navigate("/");
    }
    const passwordExpiration = new Date(user.passwordExpiration);
    const today = new Date();
    if (passwordExpiration < today) {
      alert("Your password has expired.  Please change it.");
      navigate("/accountmanage");
    }

    //check if user is authorized to see that data
    if (outcomeId && outcomeId !== "0") {
      await getOutcome(outcomeId).then((data) => {
        if(!data.data){
          alert("You do not have permission to view this page.");
          if(token){
          navigate("/user");
        }
        if (data.data.stakeholderId !== user.stakeholderId) {
          alert("You do not have permission to view this page. ");
          navigate("/user");
        }
      }});
    }

    return user;

  } catch (err) {
    console.log(err);
    alert("Error: You do not have permission to view this page or you are not logged in.");
    navigate("/");
    return null;
  }
};

const getAdminUserData = async ({ navigate, state, setState, outcomeId }) => {
  try {
    const token = loggedIn() ? getToken() : null;
    if (!token) {
      navigate("/");
      return;
    }
    const response = await getUser(token);
    if (!response.data) {
      navigate("/");
      throw new Error("something went wrong!");
    }
    const user = response.data;
    setState({
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
    const passwordExpiration = new Date(user.passwordExpiration);
    const today = new Date();
    if (passwordExpiration < today) {
      alert("Your password has expired.  Please change it.");
      navigate("/accountmanage");
    }

    //check if user is authorized to see that data
    if (outcomeId) {
      await getOutcome(outcomeId).then((data) => {
        if(!data.data){
          alert("You do not have permission to view this page.");
          if(token){
          navigate("/admin");

        } else {
          navigate("/");

        }
        if (data.data.stakeholderId !== user.stakeholderId) {
          alert("You do not have permission to view this page. ");
          navigate("/user");
        }
      }});
    }

    if (user.userRole !== "Administrator") {
      alert("You are not authorized to view this page.");
      navigate("/user");
    }

    return user;

  } catch (err) {
    alert("Error: You do not have permission to view this page or you are not logged in.");
    navigate("/");
    return null;
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
  window.confirm("You have been logged out.");
  window.location.assign("/");
};

const register = (
  firstName,
  lastName,
  email,
  password,
  userStatus,
  userRole,
  stakeholderId
) => {
  return axios.post(apiURL + "/users", {
    firstName,
    lastName,
    email,
    password,
    userStatus,
    userRole,
    stakeholderId,
  });
};

const updateUser = (body, id) => {
  return axios.put(apiURL + "/users/" + id, body);
};

export {
  authHeader,
  deleteUser,
  getAppData,
  getRoles,
  getProfile,
  getToken,
  getUser,
  getAdminUserData,
  getUserData,
  isTokenExpired,
  loggedIn,
  login,
  loginUser,
  logout,
  register,
  updateUser,
};
