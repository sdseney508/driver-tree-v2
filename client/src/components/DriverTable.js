import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import {
  activeOL,
  allDrivers,
  allOutcomes,
  getDraft,
  getOneOL,
  getSigSets,
  getToSignOL,
} from "../utils/drivers";
import { stateContext } from "../App";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS
import { Navigate } from "react-router";

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function OutcomeTable() {
  debugger;
  const [state, setState] = useContext(stateContext);
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects
  let rowD;

  async function fetchData() {
    await allOutcomes().then((data) => {
      rowD = data.data;
      console.log(rowD);
    });

    setRowData(rowD);
  }

  const getOutcome = async (outcomeId) => {
    Navigate("/user");
      };

  const gridRef = useRef(); // Optional - for accessing Grid's API

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Each Column Definition results in one Column.  For now, we are only going to set the 7 key columns that the users might search on
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "outcomeTitle",
      filter: true,
      headerName: "Outcomes",
      width: 125,
      resizable: true,
    },
    {
      field: "problemStatement",
      filter: true,
      headerName: "Problem Statement",
      width: 300,
      resizable: true,
    },
    {
      field: "state",
      filter: true,
      headerName: "State",
      width: 125,
      resizable: true,
    },
    {
      field: "status",
      filter: true,
      headerName: "status",
      width: 125,
      resizable: true,
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // sets a listener on the grid to detect when a row is selected.  From there,
  //it executes a fetch request back to the opLimit table and the signatures
  //table to get the full record for the selected row.
  // It then passes the data to the parent component to be displayed in the form.

  // const handleCallBack = () => useCallback(state);

  const cellClickedListener = useCallback(async (event) => {
    let tempID = event.data.id;
    console.log(event.data);
  });

  // async function fetchOutcome(outcomeId) {
  //   await getOutcome(outcomeID).then((data) => {
  //     let top = data.data;
  //     setSelOpLimit(top);
  //   });
  // }


  // Example using Grid's API.  i can use this to do a multi-select on the table
  //this isnt ready yet.  20 Nov 2023

  // const buttonListener = useCallback((e) => {
  //   gridRef.current.api.deselectAll();
  // }, []);

  //the return just builds the table
  return (
    <div style={{ backgroundColor: "blue", overflowX: "scroll" }}>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: "100%", height: 200 }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
}

export default OutcomeTable;
