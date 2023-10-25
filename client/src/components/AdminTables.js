import React, {
  useState,
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useContext,
} from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import {allStakeholders, createStakeholder, deleteStakeholder, updateStakeholder} from "../utils/stakeholders";
import {allOutcomes, createOutcome, updateOutcome, allDrivers, createDriver, updateDriver} from "../utils/drivers";
import { stateContext } from "../App";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function AdminTables({selectedTable, setSelectedTable}) {
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects
  let rowD;
  let columnInfo;


  useEffect(() => {
    fetchData(selectedTable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable]);


const getColumnInfo = (data) => {
  let temp =[];
  let cols = [];
  temp = Object.keys(data);
  for (let i = 1; i < temp.length; i++) {
    cols[i-1] = {field: temp[i], filter: true, headerName: temp[i], width: 125, resizable: true};
  }
  console.log(cols);
  return cols;
}

  async function fetchData(tableType) {

    if (tableType === "stakeholder") {
      await allStakeholders().then((data) => {
        columnInfo = getColumnInfo(data.data[0]);
        rowD = data.data;
      });
    } else if (tableType === "outcomes") {
      await allOutcomes().then((data) => {
        columnInfo = getColumnInfo(data.data[0]);
        rowD = data.data;
      });
    } else if (tableType === "drivers"){
      await allDrivers().then((data) => {
        columnInfo = getColumnInfo(data.data[0]);
        rowD = data.data;
      });
    }
    setRowData(rowD);
    setColumnDefs(columnInfo);
  }

  const gridRef = useRef(); // Optional - for accessing Grid's API
  // Each Column Definition results in one Column.  For now, we are only going to set the 7 key columns that the users might search on
  const [columnDefs, setColumnDefs] = useState([]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,
  }));



  // Example using Grid's API.  i can use this to do a multi-select on the table
  //this isnt ready yet.  20 Nov 2022

  // const buttonListener = useCallback((e) => {
  //   gridRef.current.api.deselectAll();
  // }, []);

  //the return just builds the table
  return (
    <div >
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}

      <div className="ag-theme-alpine" style={{ width: "100%", height: 300 }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          rowSelection="multiple" // Options - allows click selection of rows
          // onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
}

export default AdminTables;
