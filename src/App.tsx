import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login, { withAuth } from "./pages/LoginPage/LoginPage";
import Dashboard from "./components/AnalyticsDashboard/AnalyticsDashboard";

const AuthenticatedDashboard = withAuth(Dashboard);

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AuthenticatedDashboard />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
};

export default App;
