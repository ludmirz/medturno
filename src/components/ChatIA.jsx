import { useState, useRef, useEffect } from "react";

const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true";
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api"; 

//mock IA (fake IA)
const fakeIAResponse = (text) => {
  const lower = text.toLowerCase();

  if (
    lower.includes("ansiedad") || lower.includes("estres") || lower.includes("estrés") || lower.includes("triste") || lower.includes("depres") ||  lower.includes("ataque de panico") || lower.includes("no puedo dormir")) {
    return {
      text: "Por lo que describís, podría tratarse de un cuadro relacionado con la salud emocional. Sería recomendable consultar con un profesional.",
      specs: ["Psicología"],
    };
  }

  if (
    lower.includes("pecho") || lower.includes("corazon") || lower.includes("corazón") || lower.includes("palpitaciones")) {
    return {
      text: "Los síntomas que mencionás pueden estar relacionados con el sistema cardiovascular. Sería importante una evaluación médica.",
      specs: ["Cardiología"],
    };
  }

  if (
    lower.includes("cabeza") || lower.includes("migraña") || lower.includes("mareo") || lower.includes("hormigueo")) {
    return {
      text: "Podría estar relacionado con el sistema neurológico. Una evaluación médica sería recomendable.",
      specs: ["Neurología"],
    };
  }

  if (
    lower.includes("piel") || lower.includes("mancha") || lower.includes("acne") ||  lower.includes("acné") || lower.includes("erupcion")) {
    return {
      text: "Por lo que describís, podría tratarse de una condición dermatológica.",
      specs: ["Dermatología"],
    };
  }

  if (
    lower.includes("rodilla") || lower.includes("espalda") || lower.includes("hueso") || lower.includes("fractura") || lower.includes("esguince")) {
    return {
      text: "Los síntomas podrían estar relacionados con el sistema osteoarticular.",
      specs: ["Traumatología"],
    };
  }

  if (
    lower.includes("general") || lower.includes("chequeo") || lower.includes("leve") || lower.includes("malestar")) {
    return {
      text: "Podés iniciar una consulta con un médico general para una evaluación inicial.",
      specs: ["Clínica General"],
    };
  }

  if (
    lower.includes("hola") || lower.includes("buenas")) {
    return {
      text: "Hola 👋 ¿Podrías contarme qué síntomas estás teniendo?",
      specs: [],
    };
  }

  if (
    lower.includes("chau") || lower.includes("adios") || lower.includes("adiós")) {
    return {
      text: "¡Que te mejores! Si necesitás ayuda, estoy acá.",
      specs: [],
    };
  }

  return {
    text: "¿Podrías dar un poco más de detalle sobre lo que estás sintiendo?",
    specs: [],
  };
};

export default function ChatIA({ onGoToTurnos }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      role: "bot",
      text: "¡Hola! Soy tu asistente médico virtual. Contame tus síntomas y te ayudo a encontrar el especialista adecuado.",
      specs: [],
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const sendMsg = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setError(false);
    setLoading(true);

    // mensaje usuario
    const userMsg = {
      id: Date.now(),
      role: "user",
      text,
      time: new Date().toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMsg]);

    if (USE_MOCK) {
      setTimeout(() => {
        const response = fakeIAResponse(text);

        setMessages((prev) => [
          ...prev,
          {
            id: Date.now() + 1,
            role: "bot",
            text: response.text,
            specs: response.specs,
            time: new Date().toLocaleTimeString("es-AR", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          },
        ]);

        setLoading(false);
      }, 800);

      return;
    }

    //IA real (proximo a implementar)
    try {
      const res = await fetch(`${API_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Error backend");

      const data = await res.json();

      const fullText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No pude procesar tu consulta.";

      const parts = fullText.split("ESPECIALIDADES:");

      const mainText = parts[0].trim();

      const specs = parts[1]
        ? parts[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [];

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "bot",
          text: mainText,
          specs,
          time: new Date().toLocaleTimeString("es-AR", {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (err) {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className="section-title">Consultor de síntomas</p>

      <div className="chat-container">
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`msg ${msg.role}`}>
              <div className="msg-bubble">
                {msg.text}

                {msg.specs?.length > 0 && (
                  <div className="specialist-chips">
                    {msg.specs.map((spec) => (
                      <div
                        key={spec}
                        className="chip"
                        onClick={() => onGoToTurnos?.(spec)}
                      >
                        {spec} →
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="msg-time">{msg.time}</div>
            </div>
          ))}

          {loading && (
            <div className="msg bot">
              <div className="msg-bubble">Escribiendo...</div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-row">
          <input
            className="chat-input"
            value={input}
            placeholder="Ej: dolor de cabeza..."
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMsg()}
            disabled={loading}
          />

          <button
            className="send-btn"
            onClick={sendMsg}
            disabled={loading || !input.trim()}
          >
            Enviar
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: "red", fontSize: 12 }}>
          Error de conexión con el servidor
        </p>
      )}
    </div>
  );
}