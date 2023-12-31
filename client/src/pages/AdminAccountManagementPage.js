//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { getAccountStatus, getRoles } from "../utils/sign-up";
import { getAllAccountStatus } from "../utils/accountStatus";
import { getUsers } from "../utils/drivers";
import { Container, Row, Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { updateUser } from "../utils/auth";
import "./AdminAccountManage.css";
import UserTable from "../components/UserTable";

const AdminAccountManagement = () => {
  const [state, setState] = useContext(stateContext);
  const [selUser, setSelUser] = useState([]);
  const [userFormData, setUserFormData] = useState({});
  // const [validated] = useState(false);
  const [showPassAlert, setShowPassAlert] = useState(false);

  //the next two states are used to set the initial values for the role and functional area dropdowns;
  const [roleState, setRoleState] = useState([]);
  const [functionalState, setFunctionalState] = useState([]);
  const [accountState, setAccountState] = useState([]);

  //now we use state variables to get the initial values for role and functional for the form
  const [selectedRole, setuserRole] = useState("");
  const [selectedFunctional, setfunctionalArea] = useState("");
  const [selectedAccountStatus, setAccountStatus] = useState("");

  const navigate = useNavigate();

  //this gets the initial data for the page
  useEffect(() => {
    //gets the data for the administrator
    const getUserData = async () => {
      try {
        // debugger;
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
        await getUsers().then((data) => {
          setSelUser(data.data[0]);
        });

        //sets the initial user for the table below the form
        setUserFormData({
          ...userFormData,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          userStatus: user.userStatus,
          userRole: user.userRole,
        });
        // sets the intial values for the role and functional area dropdowns
        setuserRole(user.userRole);
        setAccountStatus(user.userStatus);
        let userDataLength = Object.keys(user).length;
        //if the user isnt logged in with an unexpired token, send them to the login page
        if (!userDataLength > 0) {
          navigate("/");
        }
      } catch (err) {
        console.error(err);
      }

      //get the initial state data for Roles
      let rolesOpts = await getRoles().then((data) => {
        return data.data;
      });
      setRoleState(rolesOpts);

      //get the initial state data for Account Status
      let accStatus = await getAllAccountStatus().then((data) => {
        return data.data;
      });
      setAccountState(accStatus);
    };
    getUserData();
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
    setfunctionalArea(selUser.functional);
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
    } else {
      setfunctionalArea(event.target.value);
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

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    // alert("Disabled for demo purposes");
    let body;
    if (userFormData.password !== userFormData.passVal) {
      setShowPassAlert(true);
      window("Passwords do not match");
      return;
    } else if (userFormData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{14,}$/.test(userFormData.password)) {
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
    const id = selUser.id;
    const lastName = userFormData.lastName;
    const email = userFormData.email;
    const password = userFormData.password;
    const userRole = userFormData.userRole;
    const userStatus = userFormData.accountStatus;

    if (password) {
      body = {
        firstName,
        lastName,
        email,
        userStatus,
        password,
        userRole,
      };
    } else {
      body = { firstName, lastName, email, userStatus, userRole };
    }
    await updateUser(body, id)
      .then()
      .catch((err) => console.log(err));
    form.reset();
    window.location.reload();
  };

  return (
    <>
      <Container>
        <div className="admin-account">
          <h2
            className="text-center fw-bolder"
            style={{ "textShadow": "1px 1px 1px grey" }}
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
