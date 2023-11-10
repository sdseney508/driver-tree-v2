//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { getRoles } from "../utils/sign-up";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { Container, Row, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../utils/auth";
import "./UserPage.css";

const AccountManagement = () => {
  const [state, setState] = useContext(stateContext);
  const [roleState, setRoleState] = useState([]);
  const [functionalState, setFunctionalState] = useState([]);
  const [userFormData, setUserFormData] = useState({});
  const [validated] = useState(false);
  const [showPassAlert, setShowPassAlert] = useState(false);
  const navigate = useNavigate();

  // this is getting the user data from the database to properly populate the form.  None of the form data is being updated in the database. until after you hit submit.
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
          functionalArea: user.functional,
        });
        setUserFormData({
          ...userFormData,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        });
        let userDataLength = Object.keys(user).length;
        //if the user isnt logged in with an unexpired token, send them to the login page
        if (!userDataLength > 0) {
          navigate("/");
        }
      } catch (err) {
        navigate("/");
        console.error(err);
      }
      let rolesOpts = await getRoles().then((data) => {
        return data.data;
      });
      setRoleState(rolesOpts);
    };
    getUserData();
  }, []);

  const handleInputChange = (event) => {
    setUserFormData({
      ...userFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleFormSubmit = async (event) => {
    //the user isnt allowed to change their functional area or role.  That can only be done by the Op Limit Coordinator.
    event.preventDefault();
    let body;
    console.log("handle form submit ran");
    if (userFormData.password !== userFormData.passVal) {
      setShowPassAlert(true);
      alert("Passwords do not match");
      return;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{14,}$/.test(userFormData.password)) {
      alert('The password must contain at least 14 characters including at least 1 uppercase, 1 lowercase, 1 special character and 1 number.');
      return;
    } else if (!userFormData.firstName || !userFormData.lastName) {
      setShowPassAlert(false);
      alert("First name and last name are required.");
      return;
    }
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const firstName = userFormData.firstName;
    const id = state.id;
    const lastName = userFormData.lastName;
    const email = userFormData.email;
    const password = userFormData.password;
    const passwordExpiration = Date.now();

    if (password) {
      body = { firstName, lastName, email, password, passwordExpiration };
    } else {
      body = { firstName, lastName, email };
    }

    await updateUser(body, id)
      .then()
      .catch((err) => console.log(err));
    form.reset();
  };

  return (
    <>
    <Container style={{ height: "100vh" }}>
      <div className="ips-font">
        <h2
          className="text-center fw-bolder"
          style={{ "text-shadow": "1px 1px 1px grey" }}
        >
          Account Management
        </h2>
      </div>
      <Row className="justify-content-center fw-bolder ips-font">
        <Form onSubmit={handleFormSubmit} style={{ width: "50%" }}>
          <Form.Group>
            <Form.Label htmlFor="firstName">First Name</Form.Label>
            <Form.Control
              type="string"
              name="firstName"
              onChange={handleInputChange}
              value={userFormData.firstName}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="lastName">Last Name</Form.Label>
            <Form.Control
              type="string"
              name="lastName"
              onChange={handleInputChange}
              value={userFormData.lastName}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="email">E-mail</Form.Label>
            <Form.Control
              type="email"
              name="email"
              placeholder={state.email}
              onChange={handleInputChange}
              value={userFormData.email}
              required
            ></Form.Control>
          </Form.Group>


          {/* this is just to display the Role, no changes are allowed. */}
          <Form.Group>
            <Form.Label htmlFor="role">Role</Form.Label>
            <Form.Control
              type="string"
              name="userRole"
              aria-label="userRole"
              value={state.userRole}
            ></Form.Control>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="password">New Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Your password"
              name="password"
              onChange={handleInputChange}
              value={userFormData.password}
            />
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="passVal">New Password Check</Form.Label>
            <Form.Control
              type="password"
              placeholder="Re-enter Your Password"
              name="passVal"
              onChange={handleInputChange}
              value={userFormData.passcheck}
            />
          </Form.Group>

          <Button className="m-3" type="submit" variant="success" 
          onClick={handleFormSubmit}>
            Submit
          </Button>
        </Form>
      </Row>
    </Container>
    </>
  );
};

export default AccountManagement;
