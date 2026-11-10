// Troca as seções "Seus ganhos" e "Origem dos seus ganhos" do hub, conferindo as linhas antes.
const fs = require("fs"), path = require("path");
const arq = path.join(path.resolve(__dirname, ".."), "index.html");
const L = fs.readFileSync(arq, "utf8").split("\n");
const confere = (i, s) => { if (!L[i - 1].includes(s)) { console.log("linha", i, "não confere:", L[i - 1].slice(0, 70)); process.exit(1); } };
confere(1089, "Seus ganhos <button"); confere(1097, "Origem dos seus ganhos"); confere(1104, "Dá pra ganhar mais");
const novo = fs.readFileSync(path.join(__dirname, "ganhos3.txt"), "utf8").replace(/\n$/, "").split("\n");
L.splice(1088, 1103 - 1089 + 1, ...novo);
fs.writeFileSync(arq, L.join("\n"));
console.log("ok");
