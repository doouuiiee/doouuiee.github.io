// Test MongoDB connection
require('dotenv').config();
const mongoose = require('mongoose');

async function testConnection() {
  try {
    console.log('Testing MongoDB connection...');
    console.log('MongoDB URI:', process.env.MONGODB_URI ? 'Set ✅' : 'Not set ❌');
    
    if (!process.env.MONGODB_URI) {
      console.log('\n🔧 Please set MONGODB_URI in your .env file');
      console.log('Example: MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/sao-erecord');
      return;
    }
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connected to MongoDB successfully!');
    console.log('✅ Database:', conn.connection.name);
    console.log('✅ Host:', conn.connection.host);
    
    // Test a simple operation
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('✅ Available collections:', collections.length);
    
    await mongoose.connection.close();
    console.log('✅ Connection closed properly');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('\n🔧 Check your MongoDB connection string in .env file');
    console.log('Make sure your MongoDB cluster is running and accessible');
  }
}

testConnection();