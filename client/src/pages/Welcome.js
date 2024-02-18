//Initial launch page for the Driver Tree Database
import React, { useState} from "react";
import {
  Form,
  Alert,
  Container,
  Row,
  Col,
  Button,
  Modal,
} from "react-bootstrap";
import "../assets/fonts.css";
import SignUpForm from "../components/SignUpForm";
import ForgotPass from "../components/ForgotPass";
import styles from "./Welcome.module.css";
import { login, loginUser } from "../utils/auth";
import { useNavigate } from "react-router";
import PageHeader from "../components/PageHeader";
import PageFooter from "../components/PageFooter";

const Welcome = () => {
  const [state, setState] = useState({
    selectedPMA: "PMA-262",
    selectedPEO: "PEO(U&W)",
  });
  const [showSignupModal, setSignupModal] = useState(false);
  const [showResetModal, setResetModal] = useState(false);
  const [userFormData, setUserFormData] = useState({ email: "", password: "" });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showInactiveAlert, setInactiveAlert] = useState(false);

  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const adminLogin = async (event) => {
    event.preventDefault();
    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    const user = { email: userFormData.email, password: userFormData.password };

    try {
      const response = await loginUser(user);
      const userData = response.data.user;
      if (!userData) {
        throw new Error("huh, something went wrong!");
      } else if (userData.userStatus !== "Active") {
        alert(
          "Your account isn't active yet.  Please contact your Driver Tree Admins."
        );
        return;
      } else if (userData.userRole !== "Administrator") {
        alert(
          "You are not authorized to access this page.  Please contact your local Admins."
        );
        return;
      } else {
        login(response.data.token);
        setState({
          firstName: userData.firstName,
          Role: userData.userRole,
          userId: userData.id,
        });
        navigate("/admin", { state });
      }
    } catch (err) {
      if (err.response.status === 402) {
        setInactiveAlert(true);
      } else {
      setShowAlert(true);
      }
    }

    setUserFormData({
      email: "",
      password: "",
    });
  };

  const userLogin = async (event) => {
    event.preventDefault();
    // check if form has everything (as per react-bootstrap docs)
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }
    const user = { email: userFormData.email, password: userFormData.password };

    try {
      const response = await loginUser(user);
      const userData = response.data.user;
      if (!userData) {
        throw new Error("huh, something went wrong!");
      } else if (userData.userStatus !== "Active") {
        alert(
          "Your account isn't active yet.  Please contact your Driver Tree Admins."
        );
        return;
      } else {
        login(response.data.token);
        setState({...state,
          firstName: userData.firstName,
          Role: userData.userRole,
          userId: userData.id,
          command: userData.userCommand,
          
        });
        navigate("/user");
      }
    } catch (err) {
      if (err.response.status === 402) {
        setInactiveAlert(true);
      } else {
      setShowAlert(true);
      }
    }

    setUserFormData({
      email: "",
      password: "",
    });
  };

  const onModalSubmit = (e) => {
    e.preventDefault();
    handleClose();
  };

  //close the modal
  const handleClose = () => {
    setResetModal(false);
    setSignupModal(false);
  };

  return (
    <>
      <div className={styles.welcome_page} style={{height: "135vh"}}>
        <PageHeader />
        <Container>
          <Col className="">
            <Row>
              <h3 className={styles.welcome_header}>
                Welcome to {state.selectedPEO}'s Driver Tree Database
              </h3>
            </Row>

            <Row display="flex">
              <Col sm={1} md={2} lg={3} className="justify-content-center">
                {" "}
              </Col>
              <Col
                sm={10}
                md={8}
                lg={5}
                className="d-flex flex-column justify-content-center text-center"
              >
                <Form
                  noValidate
                  validated={validated}
                  className="justify-content-center"
                >
                  <Alert
                    dismissible
                    onClose={() => setShowAlert(false)}
                    show={showAlert}
                    variant="danger"
                  >
                    Whoops, something is wrong with your login credentials!
                  </Alert>
                  <Alert
                    dismissible
                    onClose={() => setInactiveAlert(false)}
                    show={showInactiveAlert}
                    variant="danger"
                  >
                    Your account isn't active yet.  Please contact your Driver Tree Admins.
                  </Alert>
                  <Form.Group className="justify-content-center text-center">
                    <Form.Label
                      htmlFor="email"
                      className="font-weight-bold font-italic"
                    >
                      <h3
                        className={styles.welcome_h3}
                      >
                        {" "}
                        E-mail{" "}
                      </h3>
                    </Form.Label>
                    <Form.Control
                      className="justify-content-center text-center text-italic"
                      type="text"
                      placeholder="Your email"
                      name="email"
                      onChange={handleInputChange}
                      value={userFormData.email}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Email is required!
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group>
                    <Form.Label>
                      {" "}
                      <h3
                        className={styles.welcome_h3}
                      >
                        Password{" "}
                      </h3>
                    </Form.Label>
                    <Form.Control
                      className="centered"
                      type="password"
                      placeholder="Your password"
                      name="password"
                      onChange={handleInputChange}
                      value={userFormData.password}
                      required
                    />
                    <Form.Control.Feedback type="invalid">
                      Password is required!
                    </Form.Control.Feedback>
                  </Form.Group>
                </Form>

                <Row className="justify-content-center">
                  <Button
                    className={styles.my_btn}
                    disabled={!(userFormData.email && userFormData.password)}
                    type="submit"
                    variant="success"
                    onClick={userLogin}
                  >
                    Login
                  </Button>
                </Row>

                <Row className="justify-content-center">
                  <Button
                    className={styles.my_btn}
                    id="requestAccount"
                    variant="secondary"
                    onClick={() => setSignupModal(true)}
                  >
                    Request Account
                  </Button>
                </Row>
                <Row className="justify-content-center">
                  <Button
                    className={styles.my_btn}
                    id="passReset"
                    variant="warning"
                    onClick={() => setResetModal(true)}
                  >
                    Forgot Pass / Username
                  </Button>
                </Row>

                <Row className="justify-content-center">
                  <Button
                    className={styles.my_btn}
                    id="admin"
                    variant="danger"
                    name="admin"
                    disabled={!(userFormData.email && userFormData.password)}
                    type="submit"
                    onClick={adminLogin}
                  >
                    Administrator
                  </Button>
                </Row>
              </Col>
              <Col sm={1} md={2} lg={3} className="justify-content-end">
                {/* <Typewriter loop={true}/> */}
              </Col>
            </Row>
          </Col>
        </Container>
        <PageFooter />
      </div>

      <Modal
        name="signUpModal"
        size="lg"
        show={showSignupModal}
        onHide={() => setSignupModal(false)}
        aria-labelledby="signup-modal"
        className="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="signup-modal" className="ms-auto">
            Sign-up
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <SignUpForm onModalSubmit={onModalSubmit} />
        </Modal.Body>
      </Modal>

      <Modal
        name="resetPasswordModal"
        size="lg"
        show={showResetModal}
        onHide={() => setResetModal(false)}
        aria-labelledby="reset-modal"
        className="my-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title id="reset-pass" className="ms-auto">
            Request Password Reset
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*change everything in the signup form components*/}
          <ForgotPass onModalSubmit={onModalSubmit} />
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Welcome;
