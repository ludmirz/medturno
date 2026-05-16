import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import AuthModal from "./AuthModal";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

const ESPECIALIDADES = [
  { icon: "🩺", name: "Clínica General" },
  { icon: "❤️", name: "Cardiología" },
  { icon: "🔬", name: "Dermatología" },
  { icon: "👶", name: "Pediatría" },
  { icon: "🦴", name: "Traumatología" },
  { icon: "🌸", name: "Ginecología" },
  { icon: "🧠", name: "Neurología" },
  { icon: "👁️", name: "Oftalmología" },
  { icon: "💬", name: "Psicología" },
];

const HORARIOS = [
  { time: "08:00", taken: false },
  { time: "08:30", taken: false },
  { time: "09:00", taken: true },
  { time: "09:30", taken: false },
  { time: "10:00", taken: true },
  { time: "10:30", taken: false },
  { time: "11:00", taken: false },
  { time: "11:30", taken: true },
  { time: "14:00", taken: false },
  { time: "14:30", taken: false },
  { time: "15:00", taken: true },
  { time: "15:30", taken: false },
];

const OBRAS_SOCIALES = [
  "OSDE", "Swiss Medical", "Galeno", "IOMA",
  "PAMI", "Medifé", "Accord Salud", "Sancor Salud",
];

const ZONAS = [
  "Berazategui Centro", "Hudson", "Quilmes",
  "Florencio Varela", "Bernal", "Wilde",
];

export default function TurnosFlow({ modoSimulacion = false }) {
  const { usuario, token } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [step, setStep] = useState(1);
  const [osTiene, setOsTiene] = useState(false);
  const [selectedSpec, setSelectedSpec] = useState("");
  const [selectedSlot, setSelectedSlot] = useState("");
  const [turnoRef, setTurnoRef] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorGuardar, setErrorGuardar] = useState("");

  const [form, setForm] = useState({
    nombre: "", apellido: "", dni: "", email: "", zona: "",
    os: "", afiliado: "", fecha: "",
  });

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split("T")[0];
  const handleForm = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const handleConfirmar = () => {
    if (!usuario) {
      setShowAuthModal(true);
    } else {
      confirmarTurno(usuario);
    }
  };

  const confirmarTurno = async (u) => {
    setGuardando(true);
    setErrorGuardar("");

    try {
      const res = await fetch(`${API_URL}/turnos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre: u.nombre,
          apellido: u.apellido,
          dni: u.dni,
          email: u.email,
          especialidad: selectedSpec,
          zona: form.zona,
          fecha: form.fecha,
          hora: selectedSlot,
          obra_social: u.obra_social || null,
          afiliado: u.afiliado || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al guardar");

      setTurnoRef(data.ref);
      setStep(5);
    } catch (err) {
      setErrorGuardar("No se pudo guardar el turno.");
    } finally {
      setGuardando(false);
    }
  };

  const nuevoTurno = () => {
    setStep(1);
    setSelectedSpec("");
    setSelectedSlot("");
    setOsTiene(false);
    setErrorGuardar("");
    setForm({ nombre: "", dni: "", email: "", zona: "", os: "", afiliado: "", fecha: "" });
  };

  const steps = ["Datos", "Especialidad", "Horario", "Confirmar"];

  return (
    <div>
      {step < 5 && (
        <div className="step-indicator">
          {steps.map((label, i) => {
            const n = i + 1;
            const isDone = n < step;
            const isActive = n === step;
            return (
              <div key={n} className="step" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div className={`step-num ${isDone ? "done" : isActive ? "active" : ""}`}>
                  {isDone ? "✓" : n}
                </div>
                <span className={`step-label ${isActive ? "active" : ""}`}>{label}</span>
                {i < steps.length - 1 && <div className="step-line" />}
              </div>
            );
          })}
        </div>
      )}

      {/* STEP 1 */}
      {step === 1 && (
        <div>
          <p className="section-title">Tus datos</p>
          <p className="section-sub">Completá tu información para reservar el turno</p>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nombre</label>
              <input className="form-input" placeholder="Ej: María García"
                value={form.nombre} onChange={(e) => handleForm("nombre", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">Apellido</label>
              <input className="form-input" placeholder="Ej: García"
                value={form.apellido} onChange={(e) => handleForm("apellido", e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label">DNI</label>
              <input className="form-input" placeholder="Ej: 30123456"
                value={form.dni} onChange={(e) => handleForm("dni", e.target.value)} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email</label>
            <input className="form-input" type="email" placeholder="Ej: maria@email.com"
              value={form.email} onChange={(e) => handleForm("email", e.target.value)} />
          </div>

          <div className="form-group">
            <label className="form-label">Zona de atención</label>
            <select className="form-input" value={form.zona}
              onChange={(e) => handleForm("zona", e.target.value)}>
              <option value="">Seleccioná tu zona</option>
              {ZONAS.map((z) => <option key={z}>{z}</option>)}
            </select>
          </div>

          <div className="toggle-row" onClick={() => setOsTiene(!osTiene)}>
            <div className="toggle-text">
              <div className="toggle-label">Tengo obra social</div>
              <div className="toggle-sub">Agregá tu cobertura médica</div>
            </div>
            <div className={`toggle ${osTiene ? "on" : ""}`} />
          </div>

          {osTiene && (
            <div className="os-panel">
              <div className="form-group" style={{ marginBottom: 10 }}>
                <label className="form-label">Obra social</label>
                <select className="form-input" value={form.os}
                  onChange={(e) => handleForm("os", e.target.value)}>
                  <option value="">Seleccioná tu obra social</option>
                  {OBRAS_SOCIALES.map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Número de afiliado</label>
                <input className="form-input" placeholder="Ej: 1234-5678"
                  value={form.afiliado} onChange={(e) => handleForm("afiliado", e.target.value)} />
              </div>
            </div>
          )}

          <button className="btn-primary"
            disabled={!form.nombre || !form.dni || !form.email || !form.zona}
            onClick={() => setStep(2)}>
            Continuar
          </button>
        </div>
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <div>
          <p className="section-title">Especialidad</p>
          <p className="section-sub">¿Con qué tipo de médico querés consultar?</p>

          <div className="specialty-grid">
            {ESPECIALIDADES.map((esp) => (
              <div key={esp.name}
                className={`specialty-card ${selectedSpec === esp.name ? "selected" : ""}`}
                onClick={() => setSelectedSpec(esp.name)}>
                <span className="sc-icon">{esp.icon}</span>
                <div className="sc-name">{esp.name}</div>
              </div>
            ))}
          </div>

          <button className="btn-secondary" onClick={() => setStep(1)}>Atrás</button>
          <button className="btn-primary" disabled={!selectedSpec}
            onClick={() => setStep(3)}>Continuar</button>
        </div>
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <div>
          <p className="section-title">Elegí fecha y horario</p>
          <p className="section-sub">
            Turnos disponibles para{" "}
            <span style={{ color: "var(--green-dark)", fontWeight: 500 }}>{selectedSpec}</span>
          </p>

          <div className="form-group">
            <label className="form-label">Fecha</label>
            <input className="form-input" type="date" min={minDate}
              value={form.fecha} onChange={(e) => handleForm("fecha", e.target.value)} />
          </div>

          <label className="form-label" style={{ marginBottom: 10, display: "block" }}>
            Horarios disponibles
          </label>
          <div className="slot-grid">
            {HORARIOS.map((h) => (
              <div key={h.time}
                className={`slot ${h.taken ? "taken" : ""} ${selectedSlot === h.time ? "selected" : ""}`}
                onClick={() => !h.taken && setSelectedSlot(h.time)}>
                {h.time}
              </div>
            ))}
          </div>

          <button className="btn-secondary" onClick={() => setStep(2)}>Atrás</button>
          <button className="btn-primary"
            disabled={!selectedSlot || !form.fecha}
            onClick={() => setStep(4)}>Confirmar horario</button>
        </div>
      )}

      {/* STEP 4 */}
      {step === 4 && (
      <div>
        <p className="section-title">Revisá tu turno</p>
        <p className="section-sub">Verificá los datos antes de confirmar</p>
        <div className="confirm-card">
          {[
          { key: "Paciente", val: `${form.nombre} ${form.apellido}` },
          { key: "DNI", val: form.dni },
          { key: "Especialidad", val: selectedSpec },
          { key: "Zona", val: form.zona },
          { key: "Fecha y hora", val: `${form.fecha} · ${selectedSlot}` },
          {key: "Cobertura",
          val: osTiene
            ? <span className="badge-os">{form.os || "Obra social"}</span>
            : "Sin obra social",
          },
          ].map(({ key, val }) => (
          <div className="confirm-row" key={key}>
            <span className="confirm-key">{key}</span>
            <span className="confirm-val">{val}</span>
          </div>
        ))}
      </div>

      {errorGuardar && (
      <div style={{
        background: "#fff0f0", border: "0.5px solid #ffaaaa",
        borderRadius: "var(--radius-md)", padding: "12px 16px",
        marginBottom: "16px", fontSize: "13px", color: "#c0392b",
      }}>
        {errorGuardar}
      </div>
      )}

      <button className="btn-secondary" onClick={() => setStep(3)}>Atrás</button>

      {modoSimulacion ? (
      <>
        {showAuthModal && (
          <AuthModal
            initialMode="login"
            onClose={() => setShowAuthModal(false)}
            onSuccess={(u) => {
              setShowAuthModal(false);
              confirmarTurno(u);
            }}
          />
        )}
        <div style={{
          background: "var(--green-light)", border: "0.5px solid var(--green-mid)",
          borderRadius: "var(--radius-md)", padding: "14px 16px",
          fontSize: 13, color: "var(--green-dark)", textAlign: "center", marginTop: 8,
        }}>
          Este es un turno simulado.{" "}
          <strong style={{ cursor: "pointer", textDecoration: "underline" }}
            onClick={() => setShowAuthModal(true)}>
            Iniciá sesión para confirmarlo
          </strong>
        </div>
      </>
    ) : (
      <button className="btn-primary" onClick={handleConfirmar} disabled={guardando}>
        {guardando ? "Guardando..." : "Confirmar turno"}
      </button>
    )}
  </div>
)} 

      {/* STEP 5 SUCCESS */}
      {step === 5 && (
        <div className="success-box">
          <div className="success-circle">✓</div>
          <p className="success-title">¡Turno confirmado!</p>
          <p className="section-sub">
            Te enviamos un recordatorio a <strong>{form.email}</strong> el día anterior al turno.
          </p>
          <div className="turno-ref">{turnoRef}</div>
          <br />
          <button className="btn-primary" style={{ maxWidth: 220, margin: "0 auto" }}
            onClick={nuevoTurno}>Sacar otro turno</button>
        </div>
      )}
    </div>
  );
}
