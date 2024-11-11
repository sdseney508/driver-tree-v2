import React, { useState, useRef, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import {
  allStakeholders,
  createStakeholder,
  updateStakeholder,
  deleteStakeholder,
} from "../utils/stakeholders";
import {
  allDrivers,
  allOutcomes,
  updateDriver,
  updateOutcome,
} from "../utils/drivers";
import {
  createAccountStatus,
  getAllAccountStatus,
  modifyAccountStatus,
  deleteAccountStatus,
} from "../utils/accountStatus";
import { getAllRoles, modifyRole, createRole } from "../utils/roles";
import { getAllStatuses, modifyStatus, createStatus } from "../utils/status";
import {
  createArrow,
  findArrows,
  getArrow,
  getAllArrows,
  getArrows,
  updateArrow,
  deleteArrow,
} from "../utils/arrows";
import {
  updateView,
  createView,
  deleteView,
  getAllViews,
} from "../utils/views";
import "ag-grid-community/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/styles/ag-theme-alpine.css"; // Optional theme CSS

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function AdminTables({ selectedTable, setSelectedTable, state }) {
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects
  // Each Column Definition results in one Column.
  const [columnDefs, setColumnDefs] = useState([]);
  let rowD;
  let columnInfo;
  const [id, setId] = useState("");

  useEffect(() => {
    fetchData(selectedTable);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTable, id]);

  //this gets all of the coumn headers for any of the tables that the user can select
  //the Object.keys gets the keys from the first row of data.  This is used to build the column headers
  const getColumnInfo = (data) => {
    let temp = [];
    let cols = [];
    temp = Object.keys(data);
    for (let i = 1; i < temp.length; i++) {
      cols[i - 1] = {
        field: temp[i],
        filter: true,
        headerName: temp[i],
        width: 125,
        resizable: true,
      };
    }
    return cols;
  };

  async function fetchData(tableType) {
    switch (tableType) {
      case "stakeholder":
        await allStakeholders().then((data) => {
          columnInfo = getColumnInfo(data.data[0]);
          rowD = data.data;
        });
        break;
      case "outcomes":
        await allOutcomes().then((data) => {
          columnInfo = getColumnInfo(data.data[0]);
          rowD = data.data;
        });
        break;
      case "drivers":
        await allDrivers().then((data) => {
          columnInfo = getColumnInfo(data.data[0]);
          rowD = data.data;
        });
        break;
      case "accountStatus":
        await getAllAccountStatus().then((data) => {
          columnInfo = getColumnInfo(data.data[0]);
          rowD = data.data;
        });
        break;
      case "arrows":
        await getAllArrows().then((data) => {
          let arr = data.data[0];
          columnInfo = getColumnInfo(arr);
          rowD = data.data;
        });
        break;
      case "role":
        await getAllRoles().then((data) => {
          columnInfo = getColumnInfo(data.data[0]);
          rowD = data.data;
        });
        break;
      case "status":
        await getAllStatuses().then((data) => {
          columnInfo = getColumnInfo(data.data[0]);
          rowD = data.data;
        });
        break;
      case "views":
        await getAllViews().then((data) => {
          columnInfo = getColumnInfo(data.data[0]);
          rowD = data.data;
        });
        break;
      default:
    }
    setRowData(rowD);
    setColumnDefs(columnInfo);
  }

  const gridRef = useRef(); // Optional - for accessing Grid's API

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(
    () => ({
      sortable: true,
      editable: true,
      valueSetter: async (params, colDef) => {
        const body = { [params.column.colDef.field]: params.newValue };
        const id = params.data.id;
        switch (selectedTable) {
          case "stakeholder":
            await updateStakeholder(id, body);
            break;
          case "outcomes":
            await updateOutcome(id, body);
            break;
          case "drivers":
            await updateDriver(id, state.userId, body);
            break;
          case "accountStatus":
            await modifyAccountStatus(id, body);
            break;
          case "arrows":
            await updateArrow(id, body);
            break;
          case "role":
            await modifyRole(id, body);
            break;
          case "status":
            await modifyStatus(id, body);
            break;
          case "views":
            await updateView(id, body); 
            break;
          default:
        }
      },
    }),
    [selectedTable]
  );

  const cellClickedListener = async (e) => {
    setId(e.data.id);
  };

  //the return just builds the table
  return (
    <div>
      {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}

      <div className="ag-theme-alpine" style={{ width: "100%", height: 300 }}>
        <AgGridReact
          ref={gridRef} // Ref for accessing Grid's API
          rowData={rowData} // Row Data for Rows
          columnDefs={columnDefs} // Column Defs for Columns
          defaultColDef={defaultColDef} // Default Column Properties
          animateRows={true} // Optional - set to 'true' to have rows animate when sorted
          sideBar={true}
          rowSelection="multiple" // Options - allows click selection of rows
          onCellClicked={cellClickedListener} // Optional - registering for Grid Event
        />
      </div>
    </div>
  );
}

export default AdminTables;
