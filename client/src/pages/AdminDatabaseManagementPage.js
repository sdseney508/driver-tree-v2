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

  const handleClick = (e) => {
    e.preventDefault();
    console.log(e.target.id);
    setSelectedTable(e.target.id);
  };

  return (
    <>
      <Container>
        <div className="op-limits-page">
          <Row className="justify-content-center">
            <Col sm={10} md={10} lg={10} className="justify-content-center">
              <h1 className="text-center">Admin Database Management</h1>
              <h3 className="text-center" >Database Insertions and Deletions Disabled For Demo</h3>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="outcomes"
                onClick={handleClick}
              >
                Outcomes Table
              </Button>

              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="drivers"
                onClick={handleClick}
              >
                Drivers Table
              </Button>

              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="stakeholder"
                onClick={handleClick}
              >
                Stakeholders Table
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
