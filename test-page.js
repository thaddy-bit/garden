const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/produit/air-max-270-1',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`Status: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    if (data.includes('Air Max 270')) {
      console.log('✅ Page chargée avec succès - Produit trouvé');
    } else if (data.includes('Chargement du produit')) {
      console.log('⚠️ Page en chargement - Problème possible');
    } else {
      console.log('❌ Page ne contient pas le produit');
    }
  });
});

req.on('error', (e) => {
  console.error(`Erreur: ${e.message}`);
});

req.end();

