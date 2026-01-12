import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

export default function Register() {
  const [nume, setNume] = useState("");
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState("");

  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const url = `${API_BASE}/api/users`;

      // CORECTURA AICI: Folosim cheile pe care le așteaptă Prisma (fullName, password)
      const payload = {
        fullName: nume,
        email: email,
        password: parola,
        role: "STUDENT"
      };

      const res = await axios.post(url, payload);

      setMsg("Cont creat cu succes ✅ (Acum poți merge la Login)");
      console.log("register response:", res.data);
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Eroare la înregistrare";

      setMsg(`❌ ${text}`);
      console.error("register error:", err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-semibold mb-1">Register</h1>
      <p className="text-sm text-gray-600 mb-6">
        Trimite date către <code>{API_BASE}/api/users</code>
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Nume</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            value={nume}
            onChange={(e) => setNume(e.target.value)}
            placeholder="ex: Popescu Ana"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="ex: student@ase.ro"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Parolă</label>
          <input
            className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button
          disabled={loading}
          className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-60"
        >
          {loading ? "Se trimite..." : "Creează cont"}
        </button>

        {msg && <div className="text-sm mt-2">{msg}</div>}
      </form>

      <div className="text-xs text-gray-500 mt-6">
        Ai cont? <Link className="underline" to="/login">Mergi la Login</Link>
      </div>
    </div>
  );
}
