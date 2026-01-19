require('dotenv').config();
const mongoose = require('mongoose');

console.log("⏳ Intentando conectar a:", process.env.MONGO_URI.replace(/:([^:@]+)@/, ':****@'));

const options = {
    serverSelectionTimeoutMS: 5000, // Timeout sooner to fail fast
    socketTimeoutMS: 45000,
};

mongoose.connect(process.env.MONGO_URI, options)
    .then(async () => {
        console.log('✅ CONEXIÓN ÉXITOSA (Mongoose)');
        try {
            console.log('⏳ Intentando ping...');
            const admin = new mongoose.mongo.Admin(mongoose.connection.db);
            const info = await admin.buildInfo();
            console.log('✅ PING ÉXITOSO. Versión MongoDB:', info.version);
            
            console.log('⏳ Intentando buscar usuarios...');
            // Definir esquema mínimo para test
            const User = mongoose.model('User', new mongoose.Schema({}), 'users');
            const count = await User.countDocuments();
            console.log(`✅ Consulta exitosa. Hay ${count} usuarios en la colección.`);
            
        } catch (err) {
            console.error('❌ Error operando con la BD:', err);
        } finally {
            await mongoose.connection.close();
            console.log('👋 Conexión cerrada');
            process.exit(0);
        }
    })
    .catch(err => {
        console.error('❌ ERROR AL CONECTAR:', err);
        process.exit(1);
    });
