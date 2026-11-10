// Aplica os blocos da v9 no index.html, conferindo as linhas antes de trocar.
const fs = require("fs"), path = require("path");
const dir = path.resolve(__dirname, ".."), arq = path.join(dir, "index.html");
const L = fs.readFileSync(arq, "utf8").split("\n");
const bloco = n => fs.readFileSync(path.join(__dirname, n), "utf8").replace(/\n$/, "").split("\n");
const confere = (i, s) => { if (!L[i - 1].includes(s)) { console.log("linha", i, "não confere:", L[i - 1].slice(0, 70)); process.exit(1); } };
confere(1001, 'bar4("Retorno iGreen"'); confere(1041, "Ver análise completa"); confere(1042, "  }");
confere(917, 'if (v === "economia"){'); confere(942, "  }"); confere(943, 'else if (v === "cashback"){');
L.splice(1000, 1041 - 1001 + 1, ...bloco("hub2.txt"));
L.splice(916, 942 - 917 + 1, ...bloco("analise2.txt"));
fs.writeFileSync(arq, L.join("\n"));
console.log("ok");
