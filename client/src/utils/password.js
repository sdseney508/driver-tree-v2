import axios from "axios";
import apiURL from "./apiURL";

const passwordCheck = (password) => {
  //there may be a way of doing this on a single check, but i couldnt figure it out
  if (
    !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{14,}$/.test(password)
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

const passwordVal = () => {
  return axios.get(apiURL + "/roles");
};

export { passwordCheck, passwordVal };
