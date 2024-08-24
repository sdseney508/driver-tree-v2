import React, { useState, useRef, useEffect } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { getUserData } from "../utils/auth";
import { createView, getUserViewsForOutcome, updateView } from "../utils/views";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function ViewsTable({ outcomeId, setViewId, userId, viewId }) {
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects

  var rowD = [];

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [viewId]);

  const fetchData = async () => {
    let body = { userId: userId, outcomeId: outcomeId };
    await getUserViewsForOutcome(body).then((data) => {
      if (data.data.length === 0) {
        rowD = [{ viewName: "No Views Created" }];
      } else {
        rowD = data.data;
      }
    });
    setRowData(rowD);
  };

  const gridRef = useRef(); // Optional - for accessing Grid's AP

  // Each Column Definition results in one Column.  For now, we are only going to set the 7 key columns that the users might search on
  const [columnDefs, setColumnDefs] = useState([
    {
      field: "viewName",
      filter: true,
      editable: true,
      headerName: "View Name",
      width: 275,
      resizable: false,

      valueSetter: async (params) => {
        setViewId("");
        const viewName = params.newValue;
        const vId = params.data.id;
        const body = { viewName: viewName };
        await updateView(body, vId).then((data) => {
          if (data.status === 200) {
            console.log("View Name Updated");
            setViewId(vId);
          } else {
           console.log("View Name Update Failed");
          }
          setViewId(vId);
        });
      },
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useState(() => ({
    sortable: true,
  }));

  // sets a listener on the grid to detect when a row is selected.  From there,
  //it executes a fetch request back to the opLimit table and the signatures
  //table to get the full record for the selected row.
  // It then passes the data to the parent component to be displayed in the form.

  const cellClickedListener = async (event) => {
    console.log(event.data.id);
    let viewId = event.data.id;
    setViewId(viewId);
  };

  //the return just builds the table
  return (
    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
      <div
        className="ag-theme-alpine"
        style={{ width: "275px", height: "200px" }}
      >
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

export default ViewsTable;
