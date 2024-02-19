import React, { useEffect, createContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useNavigate, useLocation } from "react-router";
import axios from 'axios';
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
import apiURL from "./utils/apiURL"; 
import "./App.css";

export const stateContext = createContext();

// Construct request middleware that will attach the JWT token to every request as an `authorization` header

function App() {
  const useActivityTracker = () => {
    useEffect(() => {
      const events = ['click', 'mousemove', 'keypress'];
      const resetTimer = async () => {
        // Assuming you have an API endpoint to refresh session activity
        try {
          const token = localStorage.getItem('id_token');
          await axios.put(apiURL + '/session/refresh', {}, {
            headers: { Authorization: token },
          });
        } catch (error) {
          console.log('Error refreshing session:', error);
          // Handle error (e.g., logging out the user if session cannot be refreshed)
        }
      };
  
      for (const event of events) {
        window.addEventListener(event, resetTimer);
      }
  
      return () => {
        for (const event of events) {
          window.removeEventListener(event, resetTimer);
        }
      };
    }, []);
  };

  useActivityTracker();

  return (
    <div className="bkgrd">
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
    </div>
  );
}

export default App;
