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
  allDrivers,
  allOutcomes,
  getDriver,
  getDriverByOutcome, 
  getOutcome
} from "../utils/drivers";
import { stateContext } from "../App";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS
import { useNavigate, useLocation } from "react-router";

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function DriverTable({
  selDriver,
  setSelDriver,
  selOutcome,
  setSelOutcome
}) {
  const [state, setState] = useContext(stateContext);
  console.log("selOutcome", selOutcome);
  let location = useLocation();
  let navigate = useNavigate();

  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects
  var rowD =[];

  const gridRef = useRef(); // Optional - for accessing Grid's API

  //this runs on the initial to fetch the data for the table
  useEffect(() => {
    const fetchData= async() =>{
      console.log(selOutcome);
      await getDriverByOutcome(selOutcome.id).then((data) => {
        rowD = data.data;
      });
      setRowData(rowD);
    };
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selOutcome]);


  const getSelDriver = async (id) => {
    await getDriver(id).then((data) => {
      let top = data.data;
      setSelDriver(top);
    });
  };

  // Each Column Definition results in one Column.  For now, we are only going to set the 7 key columns that the users might search on
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "problemStatement",
      filter: true,
      headerName: "Problem Statement",
      width: 400,
      resizable: true,
    },
    {
      field: "barrier",
      filter: true,
      headerName: "Barrier",
      width: 400,
      resizable: true,
    },
    {
      field: "background",
      filter: true,
      headerName: "Background",
      width: 125,
      resizable: true,
    },
    {
      field: "desiredOutcomes",
      filter: true,
      headerName: "Desired Outcomes",
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

  async function fetchDriverInfo(driverID) {
    await getDriver(driverID).then((data) => {
      let top = data.data;
      setSelDriver(top);
    });
  };

  const cellClickedListener = useCallback(async (event) => {
    // debugger;
    let driverID = event.data.id;
    await fetchDriverInfo(driverID);
  });


  //the return just builds the table
  return (
    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div className="ag-theme-alpine" style={{ width: "100%", height: 400 }}>
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

export default DriverTable;
