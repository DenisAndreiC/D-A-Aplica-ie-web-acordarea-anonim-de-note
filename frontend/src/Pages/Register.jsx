import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    secretCode: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError("Parolele nu coincid!");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/register", {
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        secretCode: formData.secretCode
      });

      // DEBUG: Verify role
      if (formData.secretCode?.trim().toLowerCase() === "profesor" && res.data.role !== "PROFESSOR") {
        setError("DEBUG: Serverul a ignorat codul secret! Rol primit: " + res.data.role);
        return;
      }

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Eroare la înregistrare");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-gray-900 text-center">Creează Cont</h2>

        {error && <div className="mb-4 rounded bg-red-50 p-2 text-sm text-red-600">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nume Complet</label>
            <input
              type="text"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Parolă</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirmă Parola</label>
            <input
              type="password"
              required
              className="mt-1 w-full rounded-md border border-gray-300 p-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-500 uppercase">Cod Secret (Opțional - Pentru Profesori)</label>
            <input
              type="text"
              placeholder="Introdu codul pentru a deveni profesor"
              className="mt-1 w-full rounded-md border border-purple-200 bg-purple-50 p-2 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
              value={formData.secretCode || ""}
              onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
            />
          </div>

          <button
            className="w-full rounded-md bg-blue-600 py-2 text-white hover:bg-blue-700 transition disabled:opacity-50"
            type="submit"
            disabled={loading}
          >
            {loading ? "Se creează contul..." : "Înregistrează-te"}
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Ai deja cont? <a href="/login" className="text-blue-600 hover:underline">Autentifică-te</a>
        </p>
      </div>
    </div>
  );
}
