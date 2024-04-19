//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUserData} from "../utils/auth";
import UserCarousel from "../components/UserCarousel";
import "./UserPage.css";
import "./button.css";

const UserPage = () => {
  const [state, setState] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    getUserData({navigate, state, setState});
  }, []);

  return (
    <>
      <div>
        <div style={{ height: "100vh" }}>
          <span>Last Login: {state.lastLogin} </span>
          <UserCarousel />

        </div>
      </div>
    </>
  );
};

export default UserPage;
