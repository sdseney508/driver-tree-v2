//page for viewing and updating op limits
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Button} from "react-bootstrap";
import { getAdminUserData } from "../utils/auth";
import { useNavigate, useLocation } from "react-router-dom";
import AdminTables from "../components/AdminTables";
import "./DriverTreePage.module.css";
import "./button.css";

const AdminDatabaseManage = () => {
  const [state, setState] = useState([]);
  const [selectedTable, setSelectedTable] = useState("system");
  const navigate = useNavigate();
  const location = useLocation();
  const pName = location.pathname;

  useEffect( () => {
    getAdminUserData({navigate, state, setState, pName})

  }, []);

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
              <h1 className="text-center">Admin Database Management</h1>
              <h3 className="text-center" >Database Insertions and Deletions Disabled For Demo</h3>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="accountStatus"
                onClick={handleClick}
              >
                Account Status Table
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
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="arrows"
                onClick={handleClick}
              >
                Arrows Table
              </Button>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="outcomes"
                onClick={handleClick}
              >
                Outcomes Table
              </Button>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="role"
                onClick={handleClick}
              >
                Role Table
              </Button>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="status"
                onClick={handleClick}
              >
                Driver / Outcome Status Table
              </Button>
              <Button
                className="welcome-btn p-1 rounded-lg m-3"
                id="views"
                onClick={handleClick}
              >
                Views Table
              </Button>


            </Col>
          </Row>

          <AdminTables
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            state={state}
          />
        </div>
      </Container>
    </>
  );
};

export default AdminDatabaseManage;
