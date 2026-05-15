const Database = require("better-sqlite3");
const path = require("path");

const db = new Database(path.join(__dirname, "turnos.db"));

db.exec(`
CREATE TABLE IF NOT EXISTS turnos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT,
    apellido TEXT,
    dni TEXT,
    email TEXT,
    zona TEXT,
    especialidad TEXT,
    fecha TEXT,
    hora TEXT,
    obra_social TEXT,
    afiliado TEXT,
    ref TEXT UNIQUE NOT NULL,
    estado TEXT DEFAULT 'confirmado',
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
);
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    apellido TEXT NOT NULL,
    dni TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    obra_social TEXT,
    afiliado TEXT,
    creado_en DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);


module.exports = db;    

