// Troca o bloco do hub (do cabeçalho até "Dá pra ganhar mais"), conferindo as linhas antes.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
const L = fs.readFileSync(arq, "utf8").split("\n");
const confere = (i, s) => { if (!L[i - 1].includes(s)) { console.log("linha", i, "não confere:", L[i - 1].slice(0, 70)); process.exit(1); } };
confere(1096, 'el.innerHTML = `<div class="bar"><button class="icon-btn" type="button" aria-label="Voltar">');
confere(1159, "Mantenha os 15% na conta de luz"); confere(1160, "</div>`;"); confere(1161, "  }");
const novo = fs.readFileSync(path.join(__dirname, "hub3.txt"), "utf8").replace(/\n$/, "").split("\n");
L.splice(1095, 1160 - 1096 + 1, ...novo);
fs.writeFileSync(arq, L.join("\n"));
console.log("ok");
