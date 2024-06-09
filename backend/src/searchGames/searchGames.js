import fs from 'fs';

// Função para carregar os dados do JSON
function loadJSON(filePath) {
  const rawData = fs.readFileSync(filePath);
  return JSON.parse(rawData);
}

// Função para buscar jogos pelo nome
function searchGames(query, jsonData) {
  const searchResults = jsonData.applist.apps.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase())
  );
  return searchResults;
}

// Caminho para o arquivo JSON
const filePath = 'steam_apps.json';

// Carrega os dados do JSON
const jsonData = loadJSON(filePath);

// Termo de busca (pode ser passado como argumento de linha de comando)
const query = process.argv[2];

if (query) {
  const results = searchGames(query, jsonData);
  console.log('Resultados da busca:', results);
} else {
  console.log('Por favor, forneça um termo de busca.');
}