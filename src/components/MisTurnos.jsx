import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const API_URL = "http://localhost:3001/api";

export default function MisTurnos() {
  const { usuario, token } = useAuth();
  const [turnos, setTurnos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) fetchTurnos();
  }, [token]);

  const fetchTurnos = async () => {
    setCargando(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/turnos/mis-turnos`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al buscar");
      setTurnos(data);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setCargando(false);
    }
  };

  const cancelarTurno = async (ref) => {
    try {
      const res = await fetch(`${API_URL}/turnos/${ref}/cancelar`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setTurnos((prev) =>
        prev.map((t) => t.ref === ref ? { ...t, estado: "cancelado" } : t)
      );
    } catch {
      alert("No se pudo cancelar el turno.");
    }
  };

  // Sin sesión
  if (!usuario) {
    return (
      <div style={{ textAlign: "center", padding: "60px 20px" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔒</div>
        <p className="section-title">Iniciá sesión para ver tus turnos</p>
        <p className="section-sub">
          Completá el flujo de sacar turno y creá tu cuenta para acceder a esta sección.
        </p>
      </div>
    );
  }

  return (
    <div>
      <p className="section-title">Mis turnos</p>
      <p className="section-sub">
        Hola <strong>{usuario.nombre}</strong>, acá están tus consultas reservadas
      </p>

      {cargando && (
        <p style={{ color: "var(--text-2)", fontSize: 14 }}>Cargando turnos...</p>
      )}

      {error && (
        <div style={{
          background: "#fff0f0", border: "0.5px solid #ffaaaa",
          borderRadius: "var(--radius-md)", padding: "12px 16px",
          fontSize: 13, color: "#c0392b", marginBottom: 16,
        }}>
          {error}
        </div>
      )}

      {!cargando && turnos.length === 0 && (
        <div className="mis-turnos-empty">
          No tenés turnos reservados todavía.<br />
          ¡Sacá tu primer turno desde "Sacar turno"!
        </div>
      )}

      {turnos.map((t) => (
        <div className="turno-item" key={t.ref}>
          <div>
            <div className="t-esp">{t.especialidad}</div>
            <div className="t-det">
              {t.fecha} · {t.hora} · {t.zona}
              {t.obra_social ? ` · ${t.obra_social}` : ""}
            </div>
            <div className="t-ref">{t.ref}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
            <span className={`badge-estado ${t.estado === "cancelado" ? "badge-cancelado" : "badge-confirmado"}`}>
              {t.estado === "cancelado" ? "Cancelado" : "Confirmado"}
            </span>
            {t.estado !== "cancelado" && (
              <button onClick={() => cancelarTurno(t.ref)} style={{
                fontSize: 11, color: "var(--text-3)", background: "none",
                border: "none", cursor: "pointer", textDecoration: "underline",
                fontFamily: "inherit",
              }}>
                Cancelar
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}