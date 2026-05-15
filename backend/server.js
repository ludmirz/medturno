const express = require("express");
const cors = require("cors");
const turnosRoutes = require("./routes/turnos");
const authRoutes = require("./routes/auth");
const chatRoutes = require("./routes/ChatIA");
const { iniciarRecordatorios } = require("./services/recordatorios");
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.use("/api/turnos", turnosRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (req, res) => {
    res.json({ ok: true, message: "Backend funcionando correctamente" });
});

app.get("/api/login", (req, res) => {
    res.json({ ok: true, message: "Login" });
});

app.use("/api", chatRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    iniciarRecordatorios();
}); 