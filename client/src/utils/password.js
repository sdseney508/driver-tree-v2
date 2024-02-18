import axios from "axios";
import apiURL from "./apiURL";
import { loggedIn, getToken, getUser } from "./auth";

const passwordCheck = (password) => {
  //there may be a way of doing this on a single check, but i couldnt figure it out
  console.log(password);
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{14,100}$/.test(password)
  ) {
    alert('The password must contain at least 14 characters including at least 1 uppercase, 1 lowercase, 1 special character, and 1 number and no repeated characters.');
    return false;
  } else {
    const charSet = new Set();
    for (let i = 1; i < password.length-1; i++) {
      const char = password[i];
      if (password[i] === password[i - 1]) {
        alert("The password must not contain repeated characters.");
        return false;
      }
      charSet.add(char);
    }
    // If all checks pass
    return true;
  }
};

const passwordVal = async ({navigate}, password) => {
  //check the password provided against the password in the database
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
  console.log(user);
  let match=true;
  //now check the provided password against the one returned from the datbase
  if (!match) {
    alert("The old password provided is incorrect.  If you need assistance, please contact your Driver Tree Coordinator.");
    return false;
  } else {
    return true;
  }
}

export { passwordCheck, passwordVal };
