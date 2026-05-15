const cron = require("node-cron");
const nodemailer = require("nodemailer");
const db = require("../database");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "[EMAIL_ADDRESS]",
        pass: "[PASSWORD]",
    },
});

const enviarRecordatorio = async (turno) => {
    await transporter.sendMail({
        from: '"Medturno" <[EMAIL_ADDRESS]>',
        to: turno.email,
        subject: "Recordatorio de turno",
        html:
            `<div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;" >
            <h2 style="color: #1D1B4B; ">MedTurno</h2>
            <p> Hola <strong> ${turno.nombre} </strong>,</p>
            <p>Te recordamos que tenés un turno programado para <strong>mañana</strong>:</p>
            <div style="background: #f2f4f6; border-radius: 12px; padding: 16px; margin: 20px 0;">
            <p><strong>Especialidad:</strong> ${turno.especialidad}</p>
            <p><strong>Fecha:</strong> ${turno.fecha}</p>
            <p><strong>Hora:</strong> ${turno.hora}</p>
            <p><strong>Zona:</strong> ${turno.zona}</p>
            ${turno.obra_social ? `<p><strong>Obra social:</strong> ${turno.obra_social}</p>` : ""}
            <p><strong>Referencia:</strong> ${turno.ref}</p>
            </div>
            <p style="color: #5a6270; font-size: 13px;">Si necesitás cancelar tu turno, ingresá a la app.</p>
            </div>`,
    });
}

const iniciarRecordatorios = () => {
    cron.schedule("0 9 * * *", async () => {
        console.log("Buscando turnos para mañana...");
        const manana = new Date();
        manana.setDate(manana.getDate() + 1);
        const fechaManana = manana.toISOString().split("T")[0];
        const turnos = db.prepare(`SELECT * FROM turnos WHERE fecha = ? AND estado = 'confirmado'`).all(fechaManana);
        console.log(`Enviando ${turnos.length} recordatorios para mañana.`); 
        for (const turno of turnos) {
            try{
                await enviarRecordatorio(turno);
                console.log(`Recordatorio enviado a: ${turno.email}`);
            }catch(error){
                console.error(`Error enviando recordatorio a ${turno.email}`, error);
            }
        }
    });
    console.log("Sistema de recordatorios activo. Todos los dias a las 9am.");
}

module.exports = { iniciarRecordatorios };
