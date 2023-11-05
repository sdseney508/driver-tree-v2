import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { register } from "../utils/auth";
import { getRoles } from "../utils/sign-up";


const SignupForm = ({onModalSubmit}) => {
  const [roleState, setRoleState] = useState([]);
  // const [functionalState, setFunctionalState] = useState([]);
  // const [showSignupModal, setSignupModal] = useState(true);

  useEffect(() => {
    getModalData();
  }, []);

  // set initial form state
  const [userFormData, setUserFormData] = useState({});
  const [validated] = useState(false);

  //for passcheck, ensure passwords match
  const [showPassAlert, setShowPassAlert] = useState(false);

  const handleInputChange = (event) => {
    event.preventDefault();
    setUserFormData({
      ...userFormData,
      [event.target.name]: event.target.value,
    });
  };

  //gets the role and functinoal area data for the modal
  async function getModalData() {
    let rolesOpts = await getRoles().then((data) => {
      return data.data;
    });
    setRoleState(rolesOpts);
  }

  //creates the options for the role dropdown
  function roleOptions() {
    return roleState.map((f, index) => {
      return (
        <option key={index} value={f.role}>
          {f.role}
        </option>
      );
    });
  }


    //this is the function that is called when the form is submitted.  Please note, that since bcrypt is hashing the password, it will increase the password length well beyond the 14 character minimum and uses special characters so it will always pass the sequqlize validation.  If you are using bcrypt, you will need to use the regex below to validate the password.
  const handleFormSubmit = async (event) => {
    event.preventDefault();
    if (userFormData.password !== userFormData.passVal) {
      setShowPassAlert(true);
      alert("Passwords do not match");
      return;
    } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{14,}$/.test(userFormData.password)) {
      alert('The password must contain at least 14 characters including at least 1 uppercase, 1 lowercase, 1 special character, and 1 number.');
      return;
    }
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    const firstName = userFormData.firstName;
    const lastName = userFormData.lastName;
    const email = userFormData.email;
    const password = userFormData.password;
    const userStatus = "Requested";
    const userRole = userFormData.userRole;
    const functionalArea = userFormData.function;

    //fetch is popping a promise error so switching to axios
    //couldnt pass the state object so had to pass each value individually
    register(
      firstName,
      lastName,
      email,
      password,
      userStatus,
      userRole,
      functionalArea
    )
      .then((res) => console.log(res))
      .catch((err) => console.log(err));

    alert(
      "Driver Tree Admins will review your request once submitted. If you don't receive an email notification within one week, please contact your local Driver Tree Admin."
    );
    //this could also be done by setting setSignupModal to false, but i didnt want to deal with passing the props down
    onModalSubmit(event);
  };

  return (
    <>
      {/* This is needed for the validation functionality above */}
      <div>
        <h2>Sign Up</h2>
        <div>hi</div>
      </div>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        <Form.Group>
          <Form.Label htmlFor="firstName">First Name</Form.Label>
          <Form.Control
            type="string"
            placeholder="Jane"
            name="firstName"
            onChange={handleInputChange}
            // value={userFormData.firstName}
            required
          />
          <Form.Control.Feedback type="invalid">
            First Name is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="lastName">Last Name</Form.Label>
          <Form.Control
            type="string"
            placeholder="Smith"
            name="lastName"
            onChange={handleInputChange}
            // value={userFormData.lastName}
            required
          />
          <Form.Control.Feedback type="invalid">
            Last name is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="email">E-mail</Form.Label>
          <Form.Control
            type="email"
            placeholder="john.smith@I-Do-Driver-Trees.com"
            name="email"
            onChange={handleInputChange}
            // value={userFormData.email}
            required
          />
          <Form.Control.Feedback type="invalid">
            Email is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="role">Role</Form.Label>
          <Form.Select
            name="userRole"
            aria-label="userRole"
            onChange={handleInputChange}
          >
            <option disabled selected="selected">
              --Select a Role--
            </option>
            {roleOptions()}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Role is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="password">Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Password of 14 characters including at least 1 uppercase, 1 lowercase, 1 special character, and 1 number"
            name="password"
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group>
          <Form.Label htmlFor="passVal">Password Check</Form.Label>
          <Form.Control
            type="password"
            placeholder="Re-enter Your Password"
            name="passVal"
            onChange={handleInputChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            Password is required!
          </Form.Control.Feedback>
        </Form.Group>

        <Button
          disabled={
            !(
              userFormData.firstName &&
              userFormData.lastName &&
              userFormData.email &&
              userFormData.userRole &&
              userFormData.password &&
              userFormData.passVal
            )
          }
          className="m-3"
          type="submit"
          variant="success"
        >
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm;
