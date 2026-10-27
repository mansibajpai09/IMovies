const mongoose = require('mongoose');
const dns = require('dns');

// Configure reliable DNS servers for MongoDB Atlas SRV resolution
try {
  dns.setServers([
    '8.8.8.8',
    '1.1.1.1',
    '8.8.4.4'
  ]);
} catch (e) {
  // Ignore DNS override errors in environments that restrict it
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/imovies';

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`⚠️ MongoDB Connection Error: ${error.message}`);
    console.log('ℹ️ Tip: Check your MONGODB_URI in server/.env or ensure MongoDB is running on mongodb://127.0.0.1:27017/imovies');
  }
};

module.exports = connectDB;
