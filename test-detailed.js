// Detailed MongoDB connection test
require('dotenv').config();
const mongoose = require('mongoose');

async function detailedTest() {
  console.log('='.repeat(50));
  console.log('DETAILED MONGODB CONNECTION TEST');
  console.log('='.repeat(50));
  
  // Check environment
  console.log('\n1. Environment Check:');
  console.log('   MONGODB_URI exists:', !!process.env.MONGODB_URI);
  console.log('   URI length:', process.env.MONGODB_URI?.length || 0);
  
  // Parse connection string
  console.log('\n2. Connection String Analysis:');
  const uri = process.env.MONGODB_URI;
  if (uri) {
    const parts = uri.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
    if (parts) {
      console.log('   Protocol: mongodb+srv ✅');
      console.log('   Username:', parts[1]);
      console.log('   Password: ***' + parts[2].slice(-4));
      console.log('   Host:', parts[3]);
      console.log('   Database:', parts[4].split('?')[0]);
    }
  }
  
  // Try connection with detailed error
  console.log('\n3. Attempting Connection...');
  try {
    mongoose.set('debug', true); // Enable debug mode
    
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
    });
    
    console.log('\n✅ SUCCESS! Connected to MongoDB');
    console.log('   Host:', conn.connection.host);
    console.log('   Database:', conn.connection.name);
    console.log('   Port:', conn.connection.port);
    
    await mongoose.connection.close();
    console.log('\n✅ Connection closed properly');
    
  } catch (error) {
    console.log('\n❌ CONNECTION FAILED');
    console.log('   Error Type:', error.name);
    console.log('   Error Message:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n🔧 DIAGNOSIS: Connection Refused');
      console.log('   Possible causes:');
      console.log('   - Firewall blocking MongoDB (port 27017)');
      console.log('   - Antivirus blocking connection');
      console.log('   - School/work network restrictions');
      console.log('   - VPN interfering');
    } else if (error.message.includes('querySrv')) {
      console.log('\n🔧 DIAGNOSIS: DNS Resolution Failed');
      console.log('   Possible causes:');
      console.log('   - DNS server cannot resolve MongoDB SRV records');
      console.log('   - Network blocking DNS queries');
      console.log('   - Try using standard connection string instead');
    } else if (error.message.includes('Authentication')) {
      console.log('\n🔧 DIAGNOSIS: Authentication Failed');
      console.log('   - Check username and password');
      console.log('   - Verify user exists in Database Access');
    }
  }
  
  console.log('\n' + '='.repeat(50));
}

detailedTest();