import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Projects from "./Pages/Projects.jsx";
import Deliverables from "./Pages/Deliverables.jsx";
import Grade from "./Pages/Grade.jsx";
import NotFound from "./Pages/NotFound.jsx";

export default function App() {
  const location = useLocation(); // Force re-render on route change
  const user = JSON.parse(localStorage.getItem("user") || "null");

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:projectId/deliverables" element={<Deliverables />} />
        <Route path="/grade/:deliverableId" element={<Grade />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
