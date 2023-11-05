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
  getDriver,
  getDriverByOutcome,
} from "../utils/drivers";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function DriverTable({ selDriver, setSelDriver, selOutcome, setSelOutcome }) {

  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects
  let rowD;

  const gridRef = useRef(); // Optional - for accessing Grid's API

  //this runs on the initial to fetch the data for the table
  useEffect(() => {
    const fetchData = async () => {
      await getDriverByOutcome(selOutcome.id).then((data) => {
        rowD = data.data;
      });
      setRowData(rowD);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome, selDriver]);

  // Each Column Definition results in one Column.  For now, we are only going to set the 7 key columns that the users might search on
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "problemStatement",
      filter: true,
      headerName: "Problem Statement",
      width: 300,
      resizable: true,
    },
    {
      field: "barrier",
      filter: true,
      headerName: "Barrier",
      width: 300,
      resizable: true,
    },
    {
      field: "tierLevel",
      filter: true,
      headerName: "Tier Level",
      width: 125,
      resizable: true,
      sort: "asc",
      sortIndex: 1,
    },
    {
      field: "subTier",
      filter: true,
      headerName: "Sub Tier",
      width: 125,
      resizable: true,
      sort: "asc",
      sortIndex: 1,
    },


    {
      field: "background",
      filter: true,
      headerName: "Background",
      width: 200,
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
      field: "desiredOutcomes",
      filter: true,
      headerName: "Desired Outcomes",
      width: 200,
      resizable: true,
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));

  // sets a listener on the grid to detect when a row is selected.  From there,
  //it executes a fetch request back to the driver table
  //to get the full record for the selected row.
  // It then passes the data to the parent component to be displayed in the form.

  async function fetchDriverInfo(driverID) {
    await getDriver(driverID).then((data) => {
      let top = data.data;
      console.log(top);
      setSelDriver(top);
    });
  }

  const cellClickedListener = async (event) => {
    // debugger;
    let driverID = event.data.id;
    await fetchDriverInfo(driverID);
  };

  //the return just builds the table
  return (
    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: "100%", height: "100%" }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // set to 'true' to have rows animate when sorted
          rowSelection="single" // since the table feeds the form, only allow selection of a single row
          onCellClicked={cellClickedListener} // call the fetch driver info function and reseeds the table
        />
      </div>
    </div>
  );
}

export default DriverTable;
