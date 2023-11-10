//page for viewing and updating op limits
import React, { useContext, useEffect } from "react";
import { stateContext } from "../App";
import { useNavigate } from "react-router-dom";
import { getUser, loggedIn, getToken } from "../utils/auth";
// import { getCarousel } from "../utils/carousel";
import UserCarousel from "../components/UserCarousel";
import "./UserPage.css";
import "./button.css";

const UserPage = () => {
  const [state, setState] = useContext(stateContext);

  const navigate = useNavigate();

  useEffect(() => {
    const getUserData = async () => {
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
          id: user.id,
          userRole: user.userRole,
          command: user.userCommand,
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
    getUserData();
  }, []);

  return (
    <>
      <div>
        <div style={{ height: "100vh" }}>
          <UserCarousel />
        </div>
      </div>
    </>
  );
};

export default UserPage;
