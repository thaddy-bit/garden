const mysql = require('mysql2/promise');
const fs = require('fs');

// Lire le fichier .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key] = value;
  }
});

async function migrateToVariants() {
  const connection = await mysql.createConnection({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    port: envVars.DB_PORT ? parseInt(envVars.DB_PORT) : 3306,
  });

  try {
    console.log('🚀 Migration vers le système de variantes...');

    // 1. Récupérer tous les produits existants
    const [produits] = await connection.execute(`
      SELECT id, nom, couleur, taille, materiau, prix, prix_reduction, stock, sku, poids
      FROM produits 
      WHERE actif = 1
    `);

    console.log(`📦 ${produits.length} produits trouvés`);

    for (const produit of produits) {
      console.log(`\n🔄 Traitement du produit: ${produit.nom}`);

      // 2. Créer une variante pour ce produit
      const varianteSku = produit.sku || `VAR-${produit.id}-001`;
      
      const [varianteResult] = await connection.execute(`
        INSERT INTO produit_variantes (produit_id, sku, prix, prix_reduction, stock, poids)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [
        produit.id,
        varianteSku,
        produit.prix,
        produit.prix_reduction,
        produit.stock,
        produit.poids
      ]);

      const varianteId = varianteResult.insertId;
      console.log(`   ✅ Variante créée (ID: ${varianteId})`);

      // 3. Associer les attributs existants
      const attributs = [];

      // Couleur
      if (produit.couleur) {
        const [couleurAttribut] = await connection.execute(`
          SELECT id FROM attributs 
          WHERE type = 'couleur' AND valeur = ?
        `, [produit.couleur]);

        if (couleurAttribut.length > 0) {
          attributs.push(couleurAttribut[0].id);
        } else {
          // Créer l'attribut couleur s'il n'existe pas
          const [newCouleur] = await connection.execute(`
            INSERT INTO attributs (nom, type, valeur, ordre)
            VALUES ('Couleur', 'couleur', ?, 999)
          `, [produit.couleur]);
          attributs.push(newCouleur.insertId);
        }
      }

      // Taille
      if (produit.taille) {
        const [tailleAttribut] = await connection.execute(`
          SELECT id FROM attributs 
          WHERE type = 'taille' AND valeur = ?
        `, [produit.taille]);

        if (tailleAttribut.length > 0) {
          attributs.push(tailleAttribut[0].id);
        } else {
          // Créer l'attribut taille s'il n'existe pas
          const [newTaille] = await connection.execute(`
            INSERT INTO attributs (nom, type, valeur, ordre)
            VALUES ('Taille', 'taille', ?, 999)
          `, [produit.taille]);
          attributs.push(newTaille.insertId);
        }
      }

      // Matériau
      if (produit.materiau) {
        const [materiauAttribut] = await connection.execute(`
          SELECT id FROM attributs 
          WHERE type = 'materiau' AND valeur = ?
        `, [produit.materiau]);

        if (materiauAttribut.length > 0) {
          attributs.push(materiauAttribut[0].id);
        } else {
          // Créer l'attribut matériau s'il n'existe pas
          const [newMateriau] = await connection.execute(`
            INSERT INTO attributs (nom, type, valeur, ordre)
            VALUES ('Matière', 'materiau', ?, 999)
          `, [produit.materiau]);
          attributs.push(newMateriau.insertId);
        }
      }

      // 4. Lier la variante aux attributs
      for (const attributId of attributs) {
        await connection.execute(`
          INSERT INTO variante_attributs (variante_id, attribut_id)
          VALUES (?, ?)
        `, [varianteId, attributId]);
      }

      console.log(`   ✅ ${attributs.length} attributs associés`);
    }

    console.log('\n🎉 Migration terminée avec succès !');
    console.log('\n📊 Résumé:');
    console.log(`   - ${produits.length} produits migrés`);
    console.log(`   - ${produits.length} variantes créées`);
    
    // Statistiques des attributs
    const [statsAttributs] = await connection.execute(`
      SELECT type, COUNT(*) as count 
      FROM attributs 
      GROUP BY type
    `);
    
    console.log('   - Attributs créés:');
    statsAttributs.forEach(stat => {
      console.log(`     * ${stat.type}: ${stat.count}`);
    });

  } catch (error) {
    console.error('❌ Erreur lors de la migration:', error);
  } finally {
    await connection.end();
  }
}

migrateToVariants();
