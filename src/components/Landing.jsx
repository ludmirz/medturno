import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";
import { useState } from "react";

export default function Landing({ onExplorar, onSintomas }) {
  const { login } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modoModal, setModoModal] = useState("login");

  const abrirModal = (modo) => {
    setModoModal(modo);
    setShowModal(true);
  };

  return (
    <div style={{
      minHeight: "80vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 20px",
    }}>

      {showModal && (
        <AuthModal
          initialMode={modoModal}
          onClose={() => setShowModal(false)}
          onSuccess={() => setShowModal(false)}
        />
      )}

      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32 }}>
        <div style={{
          width: 12, height: 12, borderRadius: "50%", background: "#1D9E75",
        }} />
        <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: "-0.02em" }}>MedTurno</span>
      </div>

      {/* Título */}
      <h1 style={{
        fontSize: 32, fontWeight: 600, letterSpacing: "-0.03em",
        color: "var(--text)", marginBottom: 12, lineHeight: 1.2,
        maxWidth: 420,
      }}>
        Turnos médicos, sin complicaciones.
      </h1>
      <p style={{
        fontSize: 16, color: "var(--text-2)", marginBottom: 32,
        lineHeight: 1.6, maxWidth: 380,
      }}>
        Encontrá el especialista que necesitás cerca tuyo y reservá en segundos.
      </p>

      {/* Botones principales */}
      <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", justifyContent: "center" }}>
        <button className="btn-primary" style={{ width: "auto", padding: "12px 28px" }}
          onClick={() => abrirModal("login")}>
          Iniciar sesión
        </button>
        <button className="btn-secondary" style={{ width: "auto", padding: "12px 28px", marginBottom: 0 }}
          onClick={() => abrirModal("register")}>
          Registrarse
        </button>
      </div>

      {/* Síntomas */}
      <button onClick={onSintomas} style={{
        background: "none", border: "none", cursor: "pointer",
        fontSize: 14, color: "var(--green)", fontFamily: "inherit",
        marginBottom: 40, textDecoration: "underline", textUnderlineOffset: 3,
      }}>
        ¿No sabés qué especialista necesitás? Consultá tus síntomas →
      </button>

      {/* Divisor */}
      <div style={{
        width: "100%", maxWidth: 420,
        borderTop: "0.5px solid var(--border)",
        marginBottom: 32,
      }} />

      {/* Explorar sin cuenta */}
      <p style={{ fontSize: 14, color: "var(--text-2)", marginBottom: 6 }}>
        ¿Querés explorar primero?
      </p>
      <p style={{ fontSize: 13, color: "var(--text-3)", marginBottom: 16, maxWidth: 340, lineHeight: 1.6 }}>
        Podés simular un turno sin registrarte para ver zonas y obras sociales disponibles.
      </p>
      <button className="btn-secondary" style={{ width: "auto", padding: "10px 24px", marginBottom: 0 }}
        onClick={onExplorar}>
        Explorar sin cuenta
      </button>
    </div>
  );
}
