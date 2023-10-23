//page for viewing and updating op limits
import React, { useState, useContext, useEffect, setState } from "react";
import { stateContext } from "../App";
import { Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUser, loggedIn, getToken } from "../utils/auth";
// import { getCarousel } from "../utils/carousel";
import UserCarousel from "../components/UserCarousel";
import "./UserPage.css";
import "./button.css";

const UserPage = () => {
  const [state, setState] = useContext(stateContext);
  const [myWorkAlert, setMyWorkAlert] = useState(false);
  const [myOL, setMyOL] = useState(false);

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
          userRole: user.userRole
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

  const mgmt = () => {
    // 👇️ navigate to /contacts
    navigate("/accountmanage");
  };


  return (
    <>
      <div>
        <div style={{ height: "100vh" }}>
          <UserCarousel />
        </div>

        <Alert
          dismissible
          onClose={() => setMyWorkAlert(false)}
          show={myWorkAlert}
          variant="danger"
        >
          You dont have any Op Limits in Draft or Awaiting your signature.
          Contact your Op Limit coordinator if you believe this to be an error.
        </Alert>

        <Alert
          dismissible
          onClose={() => setMyOL(false)}
          show={myOL}
          variant="danger"
        >
          You dont have any Op Limits assigned to you. Contact your Op Limit
          coordinator if you believe this to be an error.
        </Alert>
      </div>
    </>
  );
};

export default UserPage;
