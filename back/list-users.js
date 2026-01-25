const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function listUsers() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', mongoose.connection.name);
        const User = mongoose.model('User', new mongoose.Schema({}, { strict: false }), 'users');
        const users = await User.find({}, { "datos_personales.email": 1, "datos_personales.nombre": 1 }).limit(5);
        console.log('Users found:', JSON.stringify(users, null, 2));
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

listUsers();
