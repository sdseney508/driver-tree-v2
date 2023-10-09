//page for viewing and updating op limits
import React, { useState, useContext, useEffect } from "react";
import { stateContext } from "../App";
import { Container, Row, Col, Button, Form } from "react-bootstrap";
import AdminTables from "../components/AdminTables";
import "./DriverTreePage.module.css";
import "./button.css";

const AdminCarouselManage = () => {
  const [state, setState] = useContext(stateContext);
  const [selectedTable, setSelectedTable] = useState("system");

  let id;

  const handleClick = (e) => {
    e.preventDefault();
    setSelectedTable(e.target.id);
  };

  return (
    <>
      <Container>
        <div className="op-limits-page">
          <Row className="justify-content-center">
            <Col sm={10} md={10} lg={10} className="justify-content-center">
              <h1 className="text-center">Admin Database Management - Database Insertions and Deletions Disabled For Demo</h1>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="aircraft"
                onClick={handleClick}
              >
                Aircraft Table
              </Button>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="system"
                onClick={handleClick}
              >
                Systems Table
              </Button>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="configuration"
                onClick={handleClick}
              >
                Configurations Table
              </Button>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="functional"
                onClick={handleClick}
              >
                Functional Roles Table
              </Button>
            </Col>
          </Row>
   
          <AdminTables
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
          />
  
        </div>
      </Container>
    </>
  );
};

export default AdminCarouselManage;
