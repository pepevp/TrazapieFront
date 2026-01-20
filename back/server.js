require('dotenv').config({ path: __dirname + '/.env' });
console.log('MONGO_URI =>', process.env.MONGO_URI);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// Servir archivos estáticos del frontend (carpeta superior)
app.use(express.static(path.join(__dirname, '../')));

const options = {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4 
};

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, options)
    .then(() => console.log('✅ Conectado a MongoDB Atlas: TrazapieDB'))
    .catch(err => console.error('❌ Error de conexión:', err));

mongoose.connection.on('error', err => console.error('🔥 Mongoose error:', err));
mongoose.connection.on('disconnected', () => console.log('⚠️ Mongoose desconectado'));

// --- ESQUEMA DE USUARIO ---
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

// 1. RUTA DE REGISTRO (NUEVA)
app.post('/api/registro', async (req, res) => {
    try {
        const datos = req.body;

        // Validar si ya existe el email
        const usuarioExistente = await User.findOne({ "datos_personales.email": datos.email });
        if (usuarioExistente) {
            return res.status(400).json({ success: false, message: "Este correo ya está registrado" });
        }

        // Crear usuario adaptando los datos planos al esquema complejo
        const nuevoUsuario = new User({
            _id: new mongoose.Types.ObjectId().toString(),
            datos_personales: {
                nombre: datos.nombre,
                apellidos: "", 
                email: datos.email,
                password: datos.password,
                perfil_fisico: {
                    peso: Number(datos.peso),
                    altura: Number(datos.altura),
                    edad: Number(datos.edad),
                    sexo: "No especificado"
                }
            },
            actividad_resumen: {
                objetivoPasos: 10000,
                pasosTotales: 0,
                registro: new Date().toISOString().split('T')[0],
                ultimaActividad: new Date().toISOString()
            },
            historial_actividad: [],
            logros: []
        });

        await nuevoUsuario.save();
        res.status(201).json({ success: true, message: "Usuario registrado correctamente" });

    } catch (error) {
        console.error("Error en registro:", error);
        res.status(500).json({ success: false, message: "Error al guardar en el servidor" });
    }
});

// 2. RUTA DE LOGIN
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

// 3. OTRAS RUTAS (Datos de usuario y actividad)
app.get('/api/usuario/:id/actividad/:fecha', async (req, res) => {
    try {
        const usuario = await User.findById(req.params.id);
        if (!usuario) return res.status(404).send('Usuario no encontrado');

        const actividadDia = usuario.historial_actividad.find(a => a.fecha === req.params.fecha);
        
        if (actividadDia) {
            res.json(actividadDia);
        } else {
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

// Ruta principal para servir el HTML si entran a la raíz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../login.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor funcionando en http://localhost:${PORT}`));