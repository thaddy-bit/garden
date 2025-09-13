// Seed 3 admin users with roles using password "passer"
// CommonJS version and loads .env.local
require('dotenv').config({ path: '.env.local' });
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 3306,
  });

  const passwordHash = await bcrypt.hash('passer', 10);

  const users = [
    { nom: 'Cashier', prenom: 'User', email: 'cashier@example.com', role: 'cashier' },
    { nom: 'Admin', prenom: 'User', email: 'admin@example.com', role: 'admin' },
    { nom: 'Super', prenom: 'Admin', email: 'superadmin@example.com', role: 'superadmin' },
  ];

  for (const u of users) {
    await connection.execute(
      `INSERT INTO users (nom, prenom, telephone, adresse, souvenir, email, password_hash, created_at, updated_at, role, status)
       VALUES (?, ?, '', '', '', ?, ?, NOW(), NOW(), ?, 'active')
       ON DUPLICATE KEY UPDATE role = VALUES(role), status = 'active'`,
      [u.nom, u.prenom, u.email, passwordHash, u.role]
    );
  }

  await connection.end();
  console.log('Seed admin users completed');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


