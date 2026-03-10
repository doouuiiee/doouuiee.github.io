// ============================================
// DATABASE SETUP SCRIPT
// ============================================

const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function setupDatabase() {
  console.log('='.repeat(50));
  console.log('SAO E-Record System - Database Setup');
  console.log('='.repeat(50));

  try {
    // Connect to MySQL without database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASS || ''
    });

    console.log('✓ Connected to MySQL server');

    // Create database if it doesn't exist
    const dbName = process.env.DB_NAME || 'sao_erecord';
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
    console.log(`✓ Database '${dbName}' created/verified`);

    // Use the database
    await connection.query(`USE ${dbName}`);

    // Read and execute schema file
    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Split by semicolon and execute each statement
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    for (const statement of statements) {
      try {
        await connection.query(statement);
      } catch (error) {
        // Ignore errors for DROP TABLE statements
        if (!statement.toUpperCase().includes('DROP TABLE')) {
          console.error('Error executing statement:', error.message);
        }
      }
    }

    console.log('✓ Database schema created successfully');

    // Create default SAO admin user
    const bcrypt = require('bcrypt');
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    try {
      await connection.query(
        'INSERT INTO users (email, password, role, is_active) VALUES (?, ?, ?, ?)',
        ['sao@cccs.edu', hashedPassword, 'sao', true]
      );
      console.log('✓ Default SAO admin user created');
      console.log('  Email: sao@cccs.edu');
      console.log('  Password: admin123');
      console.log('  ⚠️  Please change this password after first login!');
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        console.log('ℹ SAO admin user already exists');
      }
    }

    await connection.end();

    console.log('='.repeat(50));
    console.log('✓ Database setup completed successfully!');
    console.log('='.repeat(50));
    console.log('\nNext steps:');
    console.log('1. Update your .env file with database credentials');
    console.log('2. Run: npm start');
    console.log('3. Access the system at: http://localhost:5000');
    console.log('='.repeat(50));

  } catch (error) {
    console.error('✗ Database setup failed:', error.message);
    console.error('\nPlease check:');
    console.error('1. MySQL server is running');
    console.error('2. Database credentials in .env file are correct');
    console.error('3. User has permission to create databases');
    process.exit(1);
  }
}

// Run setup
setupDatabase();
