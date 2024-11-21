import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login, { withAuth } from "./pages/LoginPage/LoginPage";
import Dashboard from "./components/AnalyticsDashboard/AnalyticsDashboard";

const AuthenticatedDashboard = withAuth(Dashboard);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<AuthenticatedDashboard />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  );
};

export default App;
