import React, { useContext } from "react";
import { Row, Card } from "react-bootstrap";
import {  stateContext } from "../App";
import "./PageFooter.css";

const PageHeader = () => {
  const [state, setState] = useContext(stateContext);

  return (
    <>
      <Row className="d-flex justify-content-center">
        <Card className="p-1 rounded-lg m-3 CUI-card">
          <p className="CUI">Controlled by: Department of the Navy</p>
          <p className="CUI">Controlled by: NAVAIRSYSCOM; {state.selectedPEO}; {state.selectedPMA}</p>
          <p className="CUI">CUI Category: Controlled Technical Information</p>
          <p className="CUI">
            This document contains Controlled Unclassified Information (CUI),
            which is for official use only.
          </p>
          <br></br>
          <p className="CUI">
            DISTRIBUTION STATEMENT <br></br>
            Distribution Statement D: Distribution authorized to the DoD and
            U.S. DOD contractors only to protect proprietary and/or critical
            technology information. (2 Feb 2021). Other request shall be
            referred to {state.selectedPMA}, Naval Air Systems Command, Patuxent
            River, Maryland 20670
          </p>
          <p className="CUI">
            WARNING: This document contains technical data whose export is
            restricted by the Arms Export Control Act (Title 22, U.S.C., Sec
            2751, et seq.) or the Export Administration Act of 1979, as amended,
            Title 50, U.S.C., App. 2401 et seq. Violations of these export laws
            are subject to severe criminal penalties.
          </p>
        </Card>
      </Row>
    </>
  );
};

export default PageHeader;
