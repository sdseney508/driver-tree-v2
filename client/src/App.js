import React, { useState, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

//pages and components
import Welcome from "./pages/Welcome";
import UserPage from "./pages/UserPage";
import AccountManagementPage from "./pages/AccountManagementPage";
import AdminPage from "./pages/AdminPage";
import AdminAccountManagementPage from "./pages/AdminAccountManagementPage";
import AdminCarouselManage from "./pages/AdminCarouselManagementPage";
import AdminDatabaseManage from "./pages/AdminDatabaseManagementPage";
import AdminDriversPage from "./pages/AdminDriversPage";
import OutcomesPage from "./pages/OutcomesPage";
import DriverNavbar from "./components/DriverNavbar";
import DrPage from "./pages/DriverPage";
import DriverTreePage from "./pages/DriverTreePage";
import "./App.css";

export const stateContext = createContext();

// Construct request middleware that will attach the JWT token to every request as an `authorization` header

function App() {
  const [state, setState] = useState({
    selectedPMA: "PMA-262",
    selectedPEO: "PEO(U&W)",
  });

  return (
    <div className="bkgrd">
      <stateContext.Provider value={[state, setState]}>
        <Router>
          <>
            <DriverNavbar />
            <Routes>
              <Route path="/" element={<Welcome />} />
              <Route path="/adminaccountmanage" element={<AdminAccountManagementPage />} />
              <Route path="/admincarouselmanage" element={<AdminCarouselManage />} />
              <Route path="/admindatabasemanage" element={<AdminDatabaseManage />} />
              <Route path="/admindrivermanage" element={<AdminDriversPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/accountmanage" element={<AccountManagementPage />} />
              <Route path="/allOutcomes/:outcomeId" element={<OutcomesPage />} />
              <Route path="/drivertree/:outcomeId" element={<DriverTreePage />} />
              <Route path="/drpage/:outcomeId/:driverId" element={<DrPage />} />
              <Route path="/user" element={<UserPage />} />
              <Route
                path="*"
                element={
                  <h1 className="display-2">Sorry Chief - Wrong page!</h1>
                }
              />
            </Routes>
            
          </>
        </Router>
      </stateContext.Provider>
    </div>
  );
}

export default App;
