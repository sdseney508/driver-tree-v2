import React, { useState, useRef, useEffect, useMemo } from "react";
import { AgGridReact } from "ag-grid-react"; // the AG Grid React Component
import { getDriverByOutcome, getOutcome } from "../utils/drivers";
import "ag-grid-community/dist/styles/ag-grid.css"; // Core grid CSS, always needed
import "ag-grid-community/dist/styles/ag-theme-alpine.css"; // Optional theme CSS
import { Modal, Button } from "react-bootstrap";

//This component is used to display the limits in a table.
//it also provides the capability to sort and filter the data.
//when a user selects a row, the row data is passed to the parent component
//and displayed in the form.
//this is using the community edition and react hooks to selectively render the table
function ArrowTable({ selDriver, setSelDriver, selOutcome, setSelOutcome, selectedElements, setSelectedElements }) {
  const [rowData, setRowData] = useState([]); // Set rowData to Array of Objects
  //for the additional modal for using cluser or driver:
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };

  const handleSelect = (e) => {
    console.log(e.target.id);
    setShow(false);
  };

  const handleShow = (e) => setShow(true);
  let rowD = [];
  const gridRef = useRef(); // Optional - for accessing Grid's API

  //this runs on the initial to fetch the data for the table
  useEffect(() => {
    const fetchData = async () => {
      await getDriverByOutcome(selOutcome.id).then((data) => {
        rowD = data.data;
      });
      await getOutcome(selOutcome.id).then((data) => {
        console.log(data.data);
        rowD.push(data.data);
      });
      console.log(rowD);
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
      headerName: "Driver / Cluster Name",
      width: 300,
      resizable: true,
      headerCheckboxSelection: true,
      checkboxSelection: true,
      showDisabledCheckboxes: true,
    },
    {
      field: "tierLevel",
      filter: true,
      headerName: "Tier Level",
      width: 125,
      resizable: true,
      sort: 'asc',
      sortIndex: 0,
    },
    {
      field: "subTier",
      filter: true,
      headerName: "Sub Tier",
      width: 200,
      resizable: true,
      sort: 'asc',
      sortIndex: 1,
    },
    {
      field: "cluster",
      filter: true,
      headerName: "Cluster",
      width: 150,
      resizable: true,
    },
  ]);

  // DefaultColDef sets props common to all Columns
  const defaultColDef = useMemo(() => ({
    sortable: true,

  }));

  const gridOptions = {
    columnDefs: columnDefs,
    defaultColDef: {
      sortable: true,
    },
  }

  function sortByTierThenSubTier() {
    gridOptions.columnApi.applyColumnState({
      state: [
        { colId: 'tierLevel', sort: 'asc', sortIndex: 0 },
        { colId: 'subTier', sort: 'asc', sortIndex: 1 },
      ],
      defaultState: { sort: null },
    });};
  

  // sets a listener on the grid to detect when a row is selected.  From there,
  //it sets the state of selectedDrivers that can be used to create the cluster when the create cluster button is selected
  function onRowSelected(event) {
    if (event.data.cluster !== 0) {
      setShow(true);
    }
    var selectedRows = event.api.getSelectedRows();
    setSelectedElements(selectedRows);
  }

  function onSelectionChanged(event) {
    var selectedRows = event.api.getSelectedRows();
    setSelectedElements(selectedRows);
  }

  //the return just builds the table
  return (
    <>
      <div>
        {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", height: "100%" }}
        >
          <AgGridReact
            ref={gridRef} // Ref for accessing Grid's API
            rowData={rowData} // Row Data for Rows
            columnDefs={columnDefs} // Column Defs for Columns
            defaultColDef={defaultColDef} // Default Column Properties
            animateRows={true} // Optional - set to 'true' to have rows animate when sorted
            rowSelection="multiple" // Optional - for row selection; can be "single", "multiple" or "false" (to disable)
            suppressRowClickSelection={true} // Options - allows click selection of rows
            onRowSelected={onRowSelected}
            onSelectionChanged={onSelectionChanged} // goes to the onselectionchanged function to change the selecteddrivers state
            multiSortKey="ctrl" // allows multi column sorting using 'ctrl' key
          />
        </div>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>Woohoo, you are reading this text in a modal!</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" id="driver" onClick={handleSelect}>
            Driver
          </Button>
          <Button variant="primary" id="cluster" onClick={handleSelect}>
            Cluster
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ArrowTable;
