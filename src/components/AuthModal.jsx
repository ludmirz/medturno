import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const OBRAS_SOCIALES = [
  "OSDE", "Swiss Medical", "Galeno", "IOMA",
  "PAMI", "Medifé", "Accord Salud", "Sancor Salud",
];

export default function AuthModal({ onClose, onSuccess }) {
  const { login } = useAuth();
  const [mode, setMode] = useState("login");
  const [osTiene, setOsTiene] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    nombre: "", apellido: "", dni: "", email: "",
    password: "", obra_social: null, afiliado: null,
  });

  const handleForm = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleFormSubmit = async () => {
    setCargando(true);
    setError("");
    try {
      const url = mode === "register" ? "register" : "login";
      const res = await fetch(`${API_URL}/auth/${url}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.error);
      login(data.usuario, data.token);
      onSuccess(data.usuario);
    } catch (err) {
      setError("Error de conexión.");
    } finally {
      setCargando(false);
    }
  };

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center",
      zIndex: 100, padding: 20,
    }}>
      <div style={{
        background: "var(--surface)", borderRadius: "var(--radius-xl)",
        padding: 28, width: "100%", maxWidth: 420,
        boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
      }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 18, fontWeight: 600, letterSpacing: "-0.02em" }}>
              {mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 2 }}>
              {mode === "login" ? "Para confirmar tu turno" : "Registrate para continuar"}
            </p>
          </div>
          <button onClick={onClose} style={{
            background: "var(--surface-2)", border: "none", borderRadius: "50%",
            width: 32, height: 32, cursor: "pointer", fontSize: 16,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>×</button>
        </div>

        {/* Tabs */}
        <div style={{
          display: "flex", background: "var(--surface-2)",
          borderRadius: "var(--radius-md)", padding: 3, marginBottom: 20,
        }}>
          {["login", "register"].map((m) => (
            <button key={m}
              onClick={() => { setMode(m); setError(""); }}
              style={{
                flex: 1, padding: "7px 0", border: "none", cursor: "pointer",
                borderRadius: "var(--radius-sm)", fontSize: 13, fontFamily: "inherit",
                fontWeight: mode === m ? 500 : 400,
                background: mode === m ? "var(--surface)" : "transparent",
                color: mode === m ? "var(--text)" : "var(--text-2)",
                boxShadow: mode === m ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                transition: "all 0.15s",
              }}>
              {m === "login" ? "Iniciar sesión" : "Registrarse"}
            </button>
          ))}
        </div>

        {/* Campos registro */}
        {mode === "register" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 10 }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nombre</label>
                <input className="form-input" placeholder="María"
                  value={form.nombre} onChange={(e) => handleForm("nombre", e.target.value)} />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Apellido</label>
                <input className="form-input" placeholder="García"
                  value={form.apellido} onChange={(e) => handleForm("apellido", e.target.value)} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">DNI</label>
              <input className="form-input" placeholder="30123456"
                value={form.dni} onChange={(e) => handleForm("dni", e.target.value)} />
            </div>
          </>
        )}

        {/* Email y password */}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input className="form-input" type="email" placeholder="maria@email.com"
            value={form.email} onChange={(e) => handleForm("email", e.target.value)} />
        </div>
        <div className="form-group">
          <label className="form-label">Contraseña</label>
          <input className="form-input" type="password" placeholder="••••••••"
            value={form.password} onChange={(e) => handleForm("password", e.target.value)} />
        </div>

    {/* Obra social en registro */}
        {mode === "register" && (
          <>
            <div className="toggle-row" style={{ marginBottom: osTiene ? 10 : 16 }}
              onClick={() => setOsTiene(!osTiene)}>
              <div className="toggle-text">
                <div className="toggle-label">Tengo obra social</div>
                <div className="toggle-sub">Se usará al sacar turnos</div>
              </div>
              <div className={`toggle ${osTiene ? "on" : ""}`} />
            </div>
            {osTiene && (
              <div className="os-panel" style={{ marginBottom: 16 }}>
                <div className="form-group" style={{ marginBottom: 10 }}>
                  <label className="form-label">Obra social</label>
                  <select className="form-input" value={form.obra_social}
                    onChange={(e) => handleForm("obra_social", e.target.value)}>
                    <option value="">Seleccioná tu obra social</option>
                    {OBRAS_SOCIALES.map((o) => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Número de afiliado</label>
                  <input className="form-input" placeholder="1234-5678"
                    value={form.afiliado} onChange={(e) => handleForm("afiliado", e.target.value)} />
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div style={{
            background: "#fff0f0", border: "0.5px solid #ffaaaa",
            borderRadius: "var(--radius-md)", padding: "10px 14px",
            marginBottom: 14, fontSize: 13, color: "#c0392b",
          }}>
            {error}
          </div>
        )}

        <button className="btn-primary" onClick={handleFormSubmit} disabled={cargando}>
          {cargando ? "Cargando..." : mode === "login" ? "Iniciar sesión" : "Crear cuenta"}
        </button>
      </div>
    </div>
  );
}