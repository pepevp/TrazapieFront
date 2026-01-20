require('dotenv').config({ path: __dirname + '/.env' });
console.log('MONGO_URI =>', process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

app.use(express.static(path.join(__dirname, '../')));

const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 // Use IPv4, skip trying IPv6
};

mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log('✅ Conectado a MongoDB Atlas: TrazapieDB'))
    .catch(err => console.error('❌ Error de conexión:', err));

mongoose.connection.on('error', err => console.error('🔥 Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose desconectado'));
mongoose.connection.on('reconnected', () => console.log('🔄 Mongoose reconectado'));

// ESQUEMA ACTUALIZADO CON HISTORIAL
const userSchema = new mongoose.Schema({
    _id: String,
    datos_personales: {
        nombre: String,
        apellidos: String,
        email: String,
        password: String,
        perfil_fisico: {
            peso: Number,
            altura: Number,
            edad: Number,
            sexo: String
        }
    },
    actividad_resumen: {
        objetivoPasos: Number,
        pasosTotales: Number,
        registro: String,
        ultimaActividad: String
    },
    // NUEVO: Array para guardar cada día individualmente
    historial_actividad: [{
        fecha: String,
        pasos: Number,
        calorias: Number,
        tiempo_minutos: Number
    }],
    logros: Array
});

const User = mongoose.model('User', userSchema, 'users');

// --- RUTAS DE API ---

// Obtener datos de un día específico para el calendario
app.get('/api/usuario/:id/actividad/:fecha', async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).send('Usuario no encontrado');

        // Buscamos en el array el objeto que coincida con la fecha enviada (YYYY-MM-DD)
        const actividadDia = usuario.historial_actividad.find(a => a.fecha === req.params.fecha);
        
        if (actividadDia) {
            res.json(actividadDia);
        } else {
            // Si el día no existe en la BD, devolvemos valores en 0
            res.json({ pasos: 0, calorias: 0, tiempo_minutos: 0, fecha: req.params.fecha });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/usuario/:id', async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).send('Usuario no encontrado');
        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.put('/api/usuario/:id', async (req, res) => {
    try {
        const usuarioActualizado = await User.findByIdAndUpdate(
            req.params.id, 
            { $set: req.body }, 
            { new: true }
        );
        res.json(usuarioActualizado);
    } catch (error) {
        res.status(500).send("Error al actualizar");
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const usuario = await User.findOne({ "datos_personales.email": email });
        if (usuario) {
            if (usuario.datos_personales.password === password) {
                res.json({ 
                    success: true, 
                    userId: usuario._id,
                    nombre: usuario.datos_personales.nombre 
                });
            } else {
                res.status(401).json({ success: false, message: "Contraseña incorrecta" });
            }
        } else {
            res.status(401).json({ success: false, message: "El usuario no existe" });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`));