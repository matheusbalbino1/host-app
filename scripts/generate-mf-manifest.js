const fs = require("fs");
const path = require("path");

// Define a URL padrão para local
const legoModuleAppUrl =
  process.env.MF_CLIENTS_APP || "http://localhost:4201/remoteEntry.js";

// Define o conteúdo do manifest
const manifest = {
  legoModuleApp: legoModuleAppUrl,
};

// Caminho onde o arquivo será salvo
const manifestPath = path.join(__dirname, "../public/mf.manifest.json");

// Escreve o arquivo JSON no diretório correto
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

console.log("✅ mf.manifest.json gerado com sucesso:", manifest);
