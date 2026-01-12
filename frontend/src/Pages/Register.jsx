import { useState, useEffect } from "react";
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

  // Daca e deja logat, nu are ce cauta la register
  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard");
    }
  }, [navigate]);

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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-rose-200 to-orange-100 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white/95 backdrop-blur-xl p-8 shadow-2xl transition-all hover:shadow-orange-500/20 my-8">
        <h2 className="mb-6 text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-600">
          Creează Cont
        </h2>

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-600 border border-red-100 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 pl-1">Nume Complet</label>
            <input
              type="text"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-medium text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all placeholder-gray-400"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 pl-1">Email</label>
            <input
              type="email"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-medium text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all placeholder-gray-400"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 pl-1">Parolă</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-medium text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all placeholder-gray-400"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1 pl-1">Confirmă Parola</label>
            <input
              type="password"
              required
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 font-medium text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all placeholder-gray-400"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-pink-600/80 uppercase mb-1 pl-1">Cod Secret (Opțional - Profesori)</label>
            <input
              type="text"
              placeholder="Codul pentru profesori"
              className="w-full rounded-xl border border-pink-100 bg-pink-50/50 px-4 py-2.5 font-medium text-gray-800 outline-none focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all placeholder-pink-300"
              value={formData.secretCode || ""}
              onChange={(e) => setFormData({ ...formData, secretCode: e.target.value })}
            />
          </div>

          <button
            className="w-full rounded-xl bg-gradient-to-r from-pink-600 to-orange-500 px-4 py-3.5 text-white font-bold tracking-wide shadow-lg shadow-pink-500/30 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            type="submit"
            disabled={loading}
          >
            {loading ? "Se creează contul..." : "Înregistrează-te"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm font-medium text-gray-600">
          Ai deja cont? <a href="/login" className="text-pink-600 hover:text-orange-600 transition-colors font-bold underline decoration-2 underline-offset-2">Autentifică-te</a>
        </p>
      </div>
    </div>
  );
}
