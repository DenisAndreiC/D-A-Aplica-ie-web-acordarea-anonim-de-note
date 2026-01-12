import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const payload = {
        fullName,
        email,
        password,
        role: "STUDENT" // Implicit
      };

      await api.post("/api/auth/register", payload);

      // Redirect la login
      navigate("/login");
    } catch (err) {
      setError(
        err.response?.data?.error ||
        "Eroare la înregistrare. Încearcă alt email."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md border border-gray-100">
        <h1 className="mb-6 text-2xl font-bold text-center text-gray-800">Înregistrare</h1>

        {error && (
          <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nume Complet</label>
            <input
              type="text"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Ex: Popescu Ion"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="student@exemplu.ro"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Parolă</label>
            <input
              type="password"
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 caractere"
              required
              minLength={4}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
          >
            {loading ? "Se creează contul..." : "Creează cont"}
          </button>
        </form>

        <div className="mt-4 text-center text-sm text-gray-600">
          Ai deja cont?{" "}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
            Autentifică-te
          </Link>
        </div>
      </div>
    </div>
  );
}
