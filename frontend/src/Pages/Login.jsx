// import { useState } from "react";
// import axios from "axios";

// const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [parola, setParola] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [msg, setMsg] = useState("");

//   async function handleSubmit(e) {
//     e.preventDefault();
//     setMsg("");
//     setLoading(true);

//     try {
//       // 🔥 Backend-ul tău folosește prefixul /api/users
//       const res = await axios.post(`${API_BASE}/api/users/login`, {
//         email,
//         parola,
//       });

//       const data = res.data;

//       // dacă backend-ul returnează token, îl salvăm
//       if (data?.token) {
//         localStorage.setItem("token", data.token);
//       }

//       setMsg("Login OK ✅");
//       console.log("login response:", data);
//     } catch (err) {
//       const text =
//         err?.response?.data?.message ||
//         err?.response?.data?.error ||
//         err?.response?.data ||
//         err?.message ||
//         "Eroare la login";
//       setMsg(`❌ ${text}`);
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="max-w-md mx-auto bg-white p-6 rounded-xl shadow">
//       <h1 className="text-xl font-semibold mb-1">Login</h1>
//       <p className="text-sm text-gray-600 mb-6">
//         Introdu email + parolă și trimite către backend.
//       </p>

//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Email</label>
//           <input
//             className="w-full border rounded-lg px-3 py-2"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             type="email"
//             placeholder="ex: student@ase.ro"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Parolă</label>
//           <input
//             className="w-full border rounded-lg px-3 py-2"
//             value={parola}
//             onChange={(e) => setParola(e.target.value)}
//             type="password"
//             placeholder="••••••••"
//             required
//           />
//         </div>

//         <button
//           disabled={loading}
//           className="w-full bg-black text-white rounded-lg py-2 disabled:opacity-60"
//         >
//           {loading ? "Se trimite..." : "Login"}
//         </button>

//         {msg && <div className="text-sm mt-2">{msg}</div>}
//       </form>

//       <div className="text-xs text-gray-500 mt-6">
//         Backend: <code>{API_BASE}</code>
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import axios from "axios";

const API_BASE = "http://localhost:3000";

export default function Login() {
  const [email, setEmail] = useState("");
  const [parola, setParola] = useState(""); // momentan nu e folosită la backend
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      // Backend-ul tău NU are /api/users/login
      // Așa că facem un "login demo" folosind GET /api/users
      const res = await axios.get(`${API_BASE}/api/users`);
      const users = Array.isArray(res.data) ? res.data : res.data?.users || [];

      const found = users.find(
        (u) => String(u.email || "").toLowerCase() === email.toLowerCase()
      );

      if (!found) {
        setMsg("❌ Email inexistent (nu există user cu emailul ăsta).");
      } else {
        // Dacă backend-ul tău ar avea parolă stocată și ai vrea să verifici,
        // ar trebui endpoint de login sau comparație securizată în backend.
        setMsg("Login OK ✅ (demo) — user găsit în baza de date.");
        console.log("user găsit:", found);
      }
    } catch (err) {
      const text =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Eroare la login";
      setMsg(`❌ ${text}`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container">
      <h1 className="h1">Login</h1>
      <p className="small">Introdu email + parolă și trimite către backend.</p>

      <form onSubmit={handleSubmit}>
        <div>
          <label className="label">Email</label>
          <input
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="ex: student@ase.ro"
            required
          />
        </div>

        <div>
          <label className="label">Parolă</label>
          <input
            className="input"
            value={parola}
            onChange={(e) => setParola(e.target.value)}
            type="password"
            placeholder="••••••••"
            required
          />
        </div>

        <button disabled={loading} className="btn">
          {loading ? "Se verifică..." : "Login"}
        </button>

        {msg && <div className="err">{msg}</div>}
      </form>

      <div className="small" style={{ marginTop: 12 }}>
        Backend: <code>{API_BASE}</code>
      </div>
    </div>
  );
}
