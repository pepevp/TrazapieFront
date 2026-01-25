const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function inspectUser() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to:', mongoose.connection.name);
        
        const userCollection = mongoose.connection.collection('users');
        const user = await userCollection.findOne({ "datos_personales.email": "jesus@trazapie.com" });
        
        console.log('User found (raw):', JSON.stringify(user, null, 2));
        
        const allUsers = await userCollection.find({}).project({ "datos_personales.email": 1 }).toArray();
        console.log('All emails:', allUsers.map(u => u.datos_personales?.email));
        
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

inspectUser();
