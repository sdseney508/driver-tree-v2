//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
// import Select from "react-select";
import { stateContext } from "../App";
import { Container, Row, Col, Button} from "react-bootstrap";
import { useNavigate, useLocation } from "react-router";
import { getUser, loggedIn, getToken } from "../utils/auth";
import { createOutcome, getOutcome } from "../utils/drivers";
import "./DriverTreePage.module.css";
import OutcomeTable from "../components/OutcomeTable";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const OutcomesPage = () => {
  const [state, setState] = useContext(stateContext);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDrivers, setSelDrivers] = useState({});
  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value
  let navigate = useNavigate();

  //using the initial useEffect hook to open up the draft oplimits and prefill the form
  useEffect(() => {
    const getUserData = async () => {
      //this first part just ensures they whoever is on this page is an authenticated user; prevents someone from typing in the url and gaining access
      try {
        //these comes from the utils section of the code
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
        //used to make sure they have permissions to make changes
        setState({
          ...state,
          firstName: user.firstName,
          lastName: user.lastName,
          Role: user.userRole,
          userID: user.id,
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
    //this one gets the initial draftOL for the form
    
  }, []);


  //sets the initial selection of the drop down lists for the signatures, i couldnt get the map function to work, so brute force here we go.

  //this function gets everyone with an assigened role and sets the state for the drop down lists

  const newOutcome = async () => {
    createOutcome().then((data) => {
      setState({...state, outcomeID: data.data.id});
      navigate("/drivertree", { state: { outcomeID: data.data.id } });
    });
  }


  return (
    <>
      <div className="driver-page">
        <Container className="driver-page">
          <div>
            <Row className="justify-content-center">
              <Col sm={8} md={3} lg={3}>
                <Button
                  className="btn btn-primary p-1 m-1 my-btn"
                  onClick={newOutcome}
                >
                  Create New Outcome
                </Button>
              </Col>
              

            </Row>
       
              <OutcomeTable
              selDrivers={selDrivers}
              setSelDrivers={setSelDrivers}
              selOutcome = {selOutcome}
              setSelOutcome = {setSelOutcome}
              />
          
          </div>
        </Container>
      </div>
    </>
  );
};

export default OutcomesPage;
