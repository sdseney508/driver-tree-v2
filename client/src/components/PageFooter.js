import React from "react";
import "./PageFooter.css";
import { Row, Card } from "react-bootstrap";
const PageHeader = () => {
  return (
    <>
      <Row className="d-flex justify-content-center">
        <Card className="p-1 rounded-lg m-3 CUI-card">
          <p className="CUI">WARNING: This document contains technical data whose export is restricted by the Arms Export Control Act (Title 22, U.S.C., Sec 2751, et seq.) or the Export Administration Act of 1979, as amended, Title 50, U.S.C., App. 2401 et seq. Violations of these export laws are subject to severe criminal penalties.</p>
        </Card>
      </Row>
    </>
  );
};

export default PageHeader;
