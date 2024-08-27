//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { deleteUser, getAdminUserData } from "../utils/auth";
import { getRoles } from "../utils/sign-up";
import { getAllAccountStatus } from "../utils/accountStatus";
import { Container, Row, Button, Form } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { updateUser } from "../utils/auth";
import { passwordCheck, passwordVal } from "../utils/password";
import "./AdminAccountManage.css";
import UserTable from "../components/UserTable";

const AdminAccountManagement = () => {
  const [state, setState] = useState([]);
  const [selUser, setSelUser] = useState([]);
  const [userFormData, setUserFormData] = useState({});
  //the next two states are used to set the initial values for the role and functional area dropdowns;
  const [roleState, setRoleState] = useState([]);
  const [accountState, setAccountState] = useState([]);
  //now we use state variables to get the initial values for role and functional for the form
  const [selectedRole, setuserRole] = useState("");
  const [selectedAccountStatus, setAccountStatus] = useState("");
  const location = useLocation();
  const pName = location.pathname;
  const navigate = useNavigate();

  //this gets the initial data for the page
  useEffect(() => {
    const getFormInfo = async () => {
      //get the roles and account statuses for the dropdowns
      const roleData = await getRoles();
      const accountData = await getAllAccountStatus();
      setRoleState(roleData.data);
      setAccountState(accountData.data);
    };

    //gets the data for the administrator
    getAdminUserData({ navigate, state, setState, pName });
    getFormInfo();
    //gets the info for the form
  }, []);

  //updates the user data in the form when a new user is selected from the table
  useEffect(() => {
    setUserFormData({
      ...userFormData,
      firstName: selUser.firstName,
      lastName: selUser.lastName,
      userStatus: selUser.userStatus,
      email: selUser.email,
      userRole: selUser.userRole,
      functionalArea: selUser.functional,
    });
    setuserRole(selUser.userRole);
    setAccountStatus(selUser.userStatus);
  }, [selUser]);

  //this function is used to set the initial values for the role dropdown
  function roleOptions() {
    return roleState.map((f, index) => {
      return (
        <option key={index} value={f.role}>
          {f.role}
        </option>
      );
    });
  }

  function accountStatusOptions() {
    return accountState.map((f, index) => {
      return (
        <option key={index} value={f.accountstatus}>
          {f.accountstatus}
        </option>
      );
    });
  }

  const handleSelectChange = (event) => {
    event.preventDefault();
    if (event.target.name === "userRole") {
      setuserRole(event.target.value);
    } else if (event.target.name === "accountStatus") {
      setAccountStatus(event.target.value);
    }
    setUserFormData({
      ...userFormData,
      [event.target.name]: event.target.value,
    });
  };

  const handleInputChange = (event) => {
    event.preventDefault();
    setUserFormData({
      ...userFormData,
      [event.target.name]: event.target.value,
    });
  };

  const deleteAccount = async () => {
    await deleteUser(selUser.id, state.userId);
  };

  const handleFormSubmit = async (event) => {
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
    const id = selUser.id;
    const lastName = userFormData.lastName;
    const email = userFormData.email;
    const password = userFormData.password;
    const userRole = userFormData.userRole;
    let userStatus = userFormData.accountStatus;
    let lastLogin = Date.now();

    if (userStatus === "Delete") {
      if (window.confirm("Are you sure you want to delete this user?")) {
        console.log("deleting user");
        await deleteUser(id, state.userId);
        window.location.reload();
        return;
      } else {
        userStatus = "Active";
      }
    }

    if (password) {
      body = {
        firstName,
        lastName,
        email,
        userStatus,
        password,
        userRole,
        passwordExpiration: Date.now() + 76600000,
      };
    } else {
      body = { firstName, lastName, email, userStatus, userRole };
    }
    await updateUser(body, id);
    window.location.reload();
  };

  return (
    <>
      <Container>
        <div className="admin-account">
          <h2
            className="text-center fw-bolder"
            style={{ textShadow: "1px 1px 1px grey" }}
          >
            Admin Account Management
          </h2>
        </div>
        <div style={{ height: "50vh", overflowY: "scroll" }}>
          <div className="admin-account">
            <Row className="justify-content-center fw-bolder">
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

                <Form.Group>
                  <Form.Label htmlFor="accountStatus">
                    Account Status
                  </Form.Label>
                  <Form.Control
                    as="select"
                    name="accountStatus"
                    onChange={handleSelectChange}
                    value={selectedAccountStatus}
                  >
                    {accountStatusOptions()}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Account Status is required.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group>
                  <Form.Label htmlFor="role">Role</Form.Label>
                  <Form.Control
                    as="select"
                    name="userRole"
                    onChange={handleSelectChange}
                    value={selectedRole}
                  >
                    {roleOptions()}
                  </Form.Control>
                  <Form.Control.Feedback type="invalid">
                    Role is required!
                  </Form.Control.Feedback>
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

                <Button className="m-3" type="submit" variant="success">
                  Submit
                </Button>

              </Form>
            </Row>
          </div>
        </div>

        <div
          style={{
            height: "30vh",
            color: "black",
          }}
        >
          <UserTable selUser={selUser} setSelUser={setSelUser} />
        </div>
      </Container>
    </>
  );
};

export default AdminAccountManagement;
