const mongoose = require('mongoose');
require('dotenv').config({ path: __dirname + '/.env' });

async function checkDb() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Current Database Name:', mongoose.connection.name);
        await mongoose.disconnect();
    } catch (err) {
        console.error(err);
    }
}

checkDb();
