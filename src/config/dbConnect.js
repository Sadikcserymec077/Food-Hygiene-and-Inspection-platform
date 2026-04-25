const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
});

(async () => {
  try {
    const connection = await db.getConnection();
    console.log('✅ MySQL connection established successfully.');

    // Auto-provision the owners table needed for Phase 5
    await connection.query(`
      CREATE TABLE IF NOT EXISTS owners (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        phone VARCHAR(20),
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // --- Phase 8 Schema Provisioning ---

    // 1. Complaints AI Metadata
    const [compCols] = await connection.query("SHOW COLUMNS FROM complaints LIKE 'ai_category'");
    if (compCols.length === 0) {
      await connection.query(`ALTER TABLE complaints ADD COLUMN ai_category VARCHAR(100) DEFAULT 'unclassified', ADD COLUMN ai_severity INT DEFAULT 0`);
      console.log('✅ Added AI columns to complaints table.');
    }

    // 2. Restaurants License Expiry
    const [restCols] = await connection.query("SHOW COLUMNS FROM restaurants LIKE 'license_expiry'");
    if (restCols.length === 0) {
      await connection.query(`ALTER TABLE restaurants ADD COLUMN license_expiry DATE DEFAULT NULL`);
      console.log('✅ Added license_expiry to restaurants table.');
    }

    // 3. Inspection Reports Auto-Score
    const [repCols] = await connection.query("SHOW COLUMNS FROM inspection_reports LIKE 'auto_score'");
    if (repCols.length === 0) {
      await connection.query(`ALTER TABLE inspection_reports ADD COLUMN auto_score DECIMAL(3,2) DEFAULT 0.00`);
      console.log('✅ Added auto_score to inspection_reports table.');
    }

    connection.release();
  } catch (error) {
    console.error('❌ MySQL connection failed:', error);
  }
})();

module.exports = db;