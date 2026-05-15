import { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Landing from "./components/Landing";
import TurnosFlow from "./components/TurnosFlow";
import ChatIA from "./components/ChatIA";
import MisTurnos from "./components/MisTurnos";
import "./App.css";


function AppContent() {
  const { usuario, logout } = useAuth();
  const [activeTab, setActiveTab] = useState("turnos");
  const [modoExploracion, setModoExploracion] = useState(false);

  // Si no hay sesión y no está explorando, mostrar landing
  if (!usuario && !modoExploracion) {
    return (
      <div className="app">
        <nav className="nav">
          <div className="nav-logo">
            <span className="logo-dot" />
            MedTurno
          </div>
        </nav>
        <main className="content">
          <Landing
            onExplorar={() => {
              setModoExploracion(true);
              setActiveTab("turnos");
            }}
            onSintomas={() => {
              setModoExploracion(true);
              setActiveTab("ia");
            }}
          />
        </main>
      </div>
    );
  }

  const tabs = [
    { id: "turnos", label: usuario ? "Sacar turno" : "Simular turno" },
    { id: "ia", label: "Consultar síntomas" },
    ...(usuario ? [{ id: "misturnos", label: "Mis turnos" }] : []),
  ];

  return (
    <div className="app">
      <nav className="nav">
        <div className="nav-logo">
          <span className="logo-dot" />
          MedTurno
        </div>
        <div className="nav-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {usuario ? (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "var(--text-2)" }}>
              Hola, <strong>{usuario.nombre}</strong>
            </span>
            <button onClick={logout} style={{
              fontSize: 12, color: "var(--text-3)", background: "none",
              border: "0.5px solid var(--border-mid)", borderRadius: "var(--radius-sm)",
              padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
            }}>
              Salir
            </button>
          </div>
        ) : (
          <button onClick={() => setModoExploracion(false)} style={{
            fontSize: 12, color: "var(--green)", background: "none",
            border: "0.5px solid var(--green)", borderRadius: "var(--radius-sm)",
            padding: "4px 10px", cursor: "pointer", fontFamily: "inherit",
          }}>
            Iniciar sesión
          </button>
        )}
      </nav>

      <main className="content">
        {activeTab === "turnos" && (
          <TurnosFlow modoSimulacion={!usuario} />
        )}
        {activeTab === "ia" && (
          <ChatIA onGoToTurnos={() => setActiveTab("turnos")} />
        )}
        {activeTab === "misturnos" && usuario && <MisTurnos />}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
