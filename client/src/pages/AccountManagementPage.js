//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { Container, Row, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { getUserData, updateUser } from "../utils/auth";
import { passwordCheck, passwordVal } from "../utils/password";
import "./UserPage.css";

const AccountManagement = () => {
  const [state, setState] = useState([]);
  const [userFormData, setUserFormData] = useState({});
  const navigate = useNavigate();

  // this is getting the user data from the database to properly populate the form.  None of the form data is being updated in the database. until after you hit submit.
  useEffect(() => {
    getUserData({ navigate, state, setState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    //first check if the old password is correct
    if (
      userFormData.oldPassword ||
      userFormData.password ||
      userFormData.passVal
    ) {
      if (userFormData.password !== userFormData.passVal) {
        alert("Passwords do not match");
        return;
      } else if (passwordCheck(userFormData.password) === false) {
        return;
      } else if (passwordVal(userFormData.password) === false) {
        return;
      }
    }
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const firstName = userFormData.firstName;
    const id = state.userId;
    const lastName = userFormData.lastName;
    const email = userFormData.email;
    const password = userFormData.password;
    const passwordExpiration = Date.now();

    if (password) {
      body = { firstName, lastName, email, password, passwordExpiration };
    } else {
      body = { firstName, lastName, email };
    }

    await updateUser(body, id);
    navigate("/user");
  };

  return (
    <>
      <Container style={{ height: "100vh" }}>
        <div className="ips-font">
          <h2
            className="text-center fw-bolder"
            style={{ textShadow: "1px 1px 1px grey" }}
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
                placeholder={state.firstName}
                onChange={handleInputChange}
                value={userFormData.firstName}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="lastName">Last Name</Form.Label>
              <Form.Control
                type="string"
                name="lastName"
                placeholder={state.lastName}
                onChange={handleInputChange}
                value={state.lastName}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="email">E-mail</Form.Label>
              <Form.Control
                type="email"
                name="email"
                placeholder={state.email}
                onChange={handleInputChange}
                value={state.email}
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
              <Form.Label htmlFor="password">Old Password</Form.Label>
              <Form.Control
                type="oldPassword"
                placeholder="Your password"
                name="oldPassword"
                onChange={handleInputChange}
                value={userFormData.oldPassword}
              />
            </Form.Group>

            <Form.Group>
              <Form.Label htmlFor="password">New Password</Form.Label>
              <Form.Control
                type="password"
                title="Password must contain at least 14 characters including at least 1 uppercase, 1 lowercase, 1 special character, and 1 number and no repeated characters.  It also may not reuse 8 or more characters from your previous password."
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
                title="Password must contain at least 14 characters including at least 1 uppercase, 1 lowercase, 1 special character, and 1 number and no repeated characters.  It also may not reuse 8 or more characters from your previous password."
                placeholder="Re-enter Your Password"
                name="passVal"
                onChange={handleInputChange}
                value={userFormData.passcheck}
              />
            </Form.Group>

            <Button
              className="m-3"
              type="submit"
              variant="success"
              onClick={handleFormSubmit}
            >
              Submit
            </Button>
          </Form>
        </Row>
      </Container>
    </>
  );
};

export default AccountManagement;
