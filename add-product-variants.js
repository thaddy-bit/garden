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

async function addProductVariants() {
  const connection = await mysql.createConnection({
    host: envVars.DB_HOST,
    user: envVars.DB_USER,
    password: envVars.DB_PASSWORD,
    database: envVars.DB_NAME,
    port: envVars.DB_PORT ? parseInt(envVars.DB_PORT) : 3306,
  });

  try {
    console.log('🚀 Ajout de variantes supplémentaires...');

    // Récupérer le produit Air Max 270
    const [produits] = await connection.execute(`
      SELECT id, nom FROM produits WHERE nom = 'Air Max 270'
    `);

    if (produits.length === 0) {
      console.log('❌ Produit Air Max 270 non trouvé');
      return;
    }

    const produit = produits[0];
    console.log(`📦 Produit trouvé: ${produit.nom} (ID: ${produit.id})`);

    // Récupérer les attributs existants
    const [couleurs] = await connection.execute(`
      SELECT id, valeur FROM attributs WHERE type = 'couleur' AND valeur IN ('Blanc', 'Rouge', 'Bleu')
    `);

    const [tailles] = await connection.execute(`
      SELECT id, valeur FROM attributs WHERE type = 'taille' AND valeur IN ('40', '41', '43', '44')
    `);

    console.log(`🎨 Couleurs disponibles: ${couleurs.length}`);
    console.log(`📏 Tailles disponibles: ${tailles.length}`);

    // Créer des variantes supplémentaires
    const variantes = [
      { couleur: 'Blanc', taille: '40', prix: 150, stock: 15 },
      { couleur: 'Blanc', taille: '41', prix: 150, stock: 20 },
      { couleur: 'Blanc', taille: '43', prix: 150, stock: 18 },
      { couleur: 'Rouge', taille: '40', prix: 160, stock: 12 },
      { couleur: 'Rouge', taille: '41', prix: 160, stock: 16 },
      { couleur: 'Rouge', taille: '42', prix: 160, stock: 14 },
      { couleur: 'Bleu', taille: '41', prix: 155, stock: 10 },
      { couleur: 'Bleu', taille: '42', prix: 155, stock: 22 },
      { couleur: 'Bleu', taille: '44', prix: 155, stock: 8 }
    ];

    for (const variante of variantes) {
      // Trouver les IDs des attributs
      const couleurId = couleurs.find(c => c.valeur === variante.couleur)?.id;
      const tailleId = tailles.find(t => t.valeur === variante.taille)?.id;

      if (!couleurId || !tailleId) {
        console.log(`⚠️ Attributs manquants pour ${variante.couleur} ${variante.taille}`);
        continue;
      }

      // Créer la variante
      const sku = `NIKE-AM270-${variante.couleur.toUpperCase()}-${variante.taille}`;
      
      const [varianteResult] = await connection.execute(`
        INSERT INTO produit_variantes (produit_id, sku, prix, stock)
        VALUES (?, ?, ?, ?)
      `, [produit.id, sku, variante.prix, variante.stock]);

      const varianteId = varianteResult.insertId;

      // Associer les attributs
      await connection.execute(`
        INSERT INTO variante_attributs (variante_id, attribut_id)
        VALUES (?, ?)
      `, [varianteId, couleurId]);

      await connection.execute(`
        INSERT INTO variante_attributs (variante_id, attribut_id)
        VALUES (?, ?)
      `, [varianteId, tailleId]);

      console.log(`✅ Variante créée: ${variante.couleur} ${variante.taille} - ${variante.prix}€ (Stock: ${variante.stock})`);
    }

    console.log('\n🎉 Variantes ajoutées avec succès !');
    console.log(`📊 Total: ${variantes.length} nouvelles variantes`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await connection.end();
  }
}

addProductVariants();

