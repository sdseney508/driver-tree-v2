//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
// import Select from "react-select";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import {
  createOutcome,
  getOutcome,
  getDrivers,
  getDriverByOutcome,
  updateDriver
} from "../utils/drivers";
import { useNavigate, useLocation } from "react-router";
import { getUser, loggedIn, getToken } from "../utils/auth";
import "./DriversPage.css";
import { Form } from "react-router-dom";

//this page will only contain the Driver table, you select the driver from the table then it goes into the form

const DriverTreePage = () => {
  // debugger;
  let recordLockState = false;
  const [state, setState] = useContext(stateContext);
  const [selOutcome, setSelOutcome] = useState({});
  const [selDrivers, setSelDrivers] = useState({});
  const [driverTreeObj, setDriverTreeObj] = useState([]);
  //These are the initial states for the select boxes.  They are set to the first value in the array, which is the default value
  let location = useLocation();
  let navigate = useNavigate();
  // let driverTreeObj = [[], [], [], [], []];
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

  //this useEffect hook gets the data for the driver it was sent and sets the state for the form.
  //TODO:  add a driver table at the bottom that has all of the drivers for the currently selected outcome.  Use a drop down to select the outcome then fill in the table with the drivers for that outcome
  useEffect(() => {
    let dtree = [[], [], [], [], []];
    const getDriversData = async () => {
      console.log(selOutcome.id);
      await getDriverByOutcome(selOutcome.id).then((data) => {
        // console.log(data.data);
        setSelDrivers(data.data);
        //TODO set up an object that will calc how many levels and only display the correct number of columns
        // function drivertiers() {
        for (let i = 0; i < data.data.length; i++) {
          let level = data.data[i].tierLevel - 1; //tier level is 1 based, array is 0 based
          dtree[level].unshift(data.data[i]);
        }
        console.log(driverTreeObj);
      });
    };
    selOutcome
      ? getDriversData(selOutcome.id)
      : console.log("no outcome selected");
    console.log(dtree);

    setDriverTreeObj(dtree);
    console.log(driverTreeObj);
    //setting up a brute force for drivers in each driver tree level

    //   }
    // }
  }, [selOutcome]);

  //sets the initial selection of the drop down lists for the signatures, i couldnt get the map function to work, so brute force here we go.

  //this function gets everyone with an assigened role and sets the state for the drop down lists

  const newOutcome = () => {
    createOutcome().then((data) => {
      console.log(data);
      setSelOutcome(data.data);
      navigate("/drivers", { selOutcome });
    });
  };

  //creates the cards for each of the columns.  the cards will have a listener that will open a separate page for the specific driver.  each teir gets a map
  //TODO make this a callable function in the utils folder and import just the function then call it by tiers.

  const handleChange = (e) => {




  return (
    <>
      {/* will contain two rows that each have two columns to split the the form into fours.   */}
      <div className="">
        <Form>
          <Row>
            <Col>
            <Form.Group>
                        <Form.Label htmlFor="olconfiguration">
                          Configuration*
                        </Form.Label>
                        <Form.Control
                          as="select"
                          id="olconfiguration"
                          onBlur={handleChange}
                          readOnly={recordLockState}
                          value=""
                        >
                  
                        </Form.Control>
                      </Form.Group>
            </Col>

            <Col>
              <Button onClick={newOutcome}>New Outcome</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button onClick={newOutcome}>New Outcome</Button>
            </Col>

            <Col>
              <Button onClick={newOutcome}>New Outcome</Button>
            </Col>
          </Row>
        </Form>
      </div>
    </>
  );
};

export default DriverTreePage;
