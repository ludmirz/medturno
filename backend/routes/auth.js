const express = require("express");
const db = require("../database");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.post("/register", async (req, res) => {
    try {
        const { nombre, apellido, dni, email, password, obra_social, afiliado } = req.body;
        if (!nombre || !apellido || !dni || !email || !password)
            return res.status(400).json({ ok: false, error: "Faltan datos" });

        const existe = db.prepare("SELECT id FROM usuarios WHERE dni = ? OR email = ?").get(dni, email);
        if (existe)
            return res.status(400).json({ ok: false, error: "Ya se encuentra registrado." });

        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const stmt = db.prepare
                (`INSERT INTO usuarios (nombre, apellido, dni, email, password, obra_social, afiliado)
                VALUES (?, ?, ?, ?, ?, ?, ?)`);
            const result = stmt.run(nombre, apellido, dni, email, hashedPassword, obra_social || null, afiliado || null);
            const token = jwt.sign({ dni }, JWT_SECRET, { expiresIn: "1d" });
            res.status(201).json({ ok: true, token, user: { nombre, apellido, dni, email, obra_social, afiliado } });
        } catch (err) {
            res.status(500).json({ ok: false, error: "Error al registrar usuario" });
        }
    } catch (err) {
        res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
});

router.post("/login", async (req, res) => {
    try{
        const {email, password} = req.body;
        if (!email || !password)
            return res.status(400).json({ ok: false, error: "Faltan datos" });

        const user = db.prepare("SELECT * FROM usuarios WHERE email = ?").get(email);
        if (!user)
            return res.status(401).json({ ok: false, error: "Email y/o contraseña incorrectos" });

        const match = bcrypt.compareSync(password, user.password);
        if (!match)
            return res.status(401).json({ ok: false, error: "Email y/o contraseña incorrectos" });

        const token = jwt.sign(
            { id: user.id, nombre: user.nombre, apellido: user.apellido, email: user.email, dni: user.dni, obra_social: user.obra_social, afiliado: user.afiliado },
            JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({ 
            ok: true, 
            token, 
            usuario: { nombre: user.nombre, apellido: user.apellido, email: user.email, dni: user.dni, obra_social: user.obra_social, afiliado: user.afiliado } 
        });
    } catch (err) {
        res.status(500).json({ ok: false, error: "Error interno del servidor" });
    }
});

module.exports = router;
