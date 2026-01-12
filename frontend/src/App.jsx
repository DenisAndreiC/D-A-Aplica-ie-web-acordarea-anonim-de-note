import { Routes, Route, Navigate, Link } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Register from "./Pages/Register.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Projects from "./Pages/Projects.jsx";
import Deliverables from "./Pages/Deliverables.jsx";
import Grade from "./Pages/Grade.jsx";
import NotFound from "./Pages/NotFound.jsx";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">Acordare anonimă de note</div>
          <nav className="flex gap-4 text-sm">
            <Link className="hover:underline" to="/login">Login</Link>
            <Link className="hover:underline" to="/register">Register</Link>
            <Link className="hover:underline" to="/dashboard">Dashboard</Link>
            <Link className="hover:underline" to="/projects">Projects</Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8">
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
      </main>
    </div>
  );
}
