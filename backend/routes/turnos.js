const express = require("express");
const router = express.Router();
const db = require("../database");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "medturno_secret_key";

// Middleware
const verificarAuth = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ ok: false, error: "Token no provisto" });
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(403).json({ ok: false, error: "Token inválido" });
  }
};

// Mis turnos (con token)
router.get("/mis-turnos", verificarAuth, (req, res) => {
  const turnos = db
    .prepare("SELECT * FROM turnos WHERE dni = ? ORDER BY fecha, hora ASC")
    .all(req.user.dni);
  res.json(turnos);
});

// Todos los turnos
router.get("/", (req, res) => {
  const turnos = db.prepare("SELECT * FROM turnos ORDER BY fecha, hora ASC").all();
  res.json(turnos);
});

// Crear turno
router.post("/", (req, res) => {
  const { nombre, apellido, dni, email, zona, especialidad, fecha, hora, obra_social, afiliado } = req.body;

  if (!nombre || !apellido || !dni || !email || !zona || !especialidad || !fecha || !hora) {
    return res.status(400).json({ error: "Faltan campos obligatorios" });
  }

  const ref = "TRN-" + Math.floor(1000 + Math.random() * 9000);

  try {
    const stmt = db.prepare(`
      INSERT INTO turnos (nombre, apellido, dni, email, zona, especialidad, fecha, hora, obra_social, afiliado, ref)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    stmt.run(nombre, apellido, dni, email, zona, especialidad, fecha, hora, obra_social || null, afiliado || null, ref);
    res.status(201).json({ ok: true, ref });
  } catch (err) {
    res.status(500).json({ error: "Error al guardar el turno." });
  }
});

// Cancelar turno
router.patch("/:ref/cancelar", (req, res) => {
  try {
    const result = db
      .prepare("UPDATE turnos SET estado = 'cancelado' WHERE ref = ?")
      .run(req.params.ref);
    if (result.changes === 0) {
      return res.status(404).json({ error: "Turno no encontrado" });
    }
    res.json({ ok: true });
  } catch {
    res.status(500).json({ error: "Error al cancelar el turno" });
  }
});

module.exports = router;