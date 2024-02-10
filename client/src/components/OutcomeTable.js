import React, { useState, useRef, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { getOutcome, outcomeByCommand } from "../utils/drivers";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function OutcomeTable({ selOutcome, setSelOutcome, command }) {
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects
  var rowD = [];

  async function fetchData() {
    await outcomeByCommand(command).then((data) => {
      rowD = data.data;
    });
    setRowData(rowD);
  }

  const gridRef = useRef(); // Optional - for accessing Grid's AP

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome]);

  // Each Column Definition results in one Column.  For now, we are only going to set the 7 key columns that the users might search on
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "outcomeTitle",
      filter: true,
      headerName: "Outcomes",
      width: 400,
      resizable: true,
      sort: "asc",
      sortIndex: 1,
    },
    {
      field: "problemStatement",
      filter: true,
      headerName: "Problem Statement",
      width: 400,
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
      headerName: "Status",
      width: 125,
      resizable: true,
    },
    {
      field: "version",
      filter: true,
      headerName: "Version",
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

  async function fetchOutcomeInfo(outcomeId) {
    await getOutcome(outcomeId).then((data) => {
      setSelOutcome(data.data);
    });
  }

  const cellClickedListener = async (event) => {
    let outcomeId = event.data.id;
    await fetchOutcomeInfo(outcomeId);
  };

  //the return just builds the table
  return (
    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ height: "200px" }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // set to 'true' to have rows animate when sorted
          rowSelection="single" // set to single since the table feeds the form
          onCellClicked={cellClickedListener} // calls the fetchouctomeinfo function and reseeds the table
        />
      </div>
    </div>
  );
}

export default OutcomeTable;
